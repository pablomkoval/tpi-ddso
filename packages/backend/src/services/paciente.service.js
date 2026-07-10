import { BadRequestError, NotFoundError } from "../shared/errors/AppError.js";
import { EstadoTurno } from "../domain/enum/EstadoTurno.js";
import { SolicitudCambioTurno } from "../domain/models/entities/turnos/SolicitudCambioTurno.js";

//cancelación permitida hasta 1 hora antes, mandar a env
const MINUTOS_MINIMOS_CANCELACION = 60;

export class PacienteService {
  usuarioService
  constructor(
    pacienteRepository,
    turnoRepository,
    notificacionesService,
    solicitudCambioTurnoRepository,
  ) {
    this.pacienteRepository = pacienteRepository;
    this.turnoRepository = turnoRepository;
    this.notificacionesService = notificacionesService;
    this.solicitudCambioTurnoRepository = solicitudCambioTurnoRepository;
  }

  async create(data) {
    return await this.pacienteRepository.save(data);
  }

  async update(id, data) {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new NotFoundError(
        `Paciente con id ${id} no encontrado`,
        "PACIENTE_NO_ENCONTRADO",
      );
    }
    return await this.pacienteRepository.update(id, data);
  }

  async findAll() {
    return await this.pacienteRepository.findAll();
  }

  async findById(id) {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new NotFoundError(
        `Paciente con id ${id} no encontrado`,
        "PACIENTE_NO_ENCONTRADO",
      );
    }
    return paciente;
  }

  async findByIdUsuario(id, username) {
    // Buscar primero por el ID de usuario de MongoDB
    let paciente = await this.pacienteRepository.findByIdUsuario(id);

    // Fallback: buscar por nombre de usuario (para pacientes creados manualmente vía Keycloak)
    if (!paciente && username) {
      paciente = await this.pacienteRepository.findByUsername(username);
      // Si se encuentra, actualizar el campo usuario para que el ID sea correcto en el futuro
      if (paciente) {
        await this.pacienteRepository.updateUsuarioId(paciente._id, id);
      }
    }

    if (!paciente) {
      throw new NotFoundError("Paciente no encontrado para el usuario actual", "PACIENTE_NO_ENCONTRADO");
    }

    return paciente;
  }


  async consultarHistorial(pacienteId) {
    await this.findById(pacienteId);
    const turnos = await this.turnoRepository.findByPaciente(pacienteId);

    const solicitudesPendientes = await this.solicitudCambioTurnoRepository.model.find({
      pacienteId: String(pacienteId),
      estado: "PENDIENTE",
    });

    const originalIds = new Set(solicitudesPendientes.map((s) => String(s.turnoOriginal)));
    const nuevoIds = new Set(solicitudesPendientes.map((s) => String(s.turnoNuevo)));

    return turnos.map((turno) => {
      const turnoObj = turno.toObject ? turno.toObject() : turno;
      const idStr = String(turnoObj._id || turnoObj.id);
      if (originalIds.has(idStr) || nuevoIds.has(idStr)) {
        return {
          ...turnoObj,
          estado: "PENDIENTE",
        };
      }
      return turnoObj;
    });
  }

  async reservarTurno(pacienteId, turnoId) {
    const paciente = await this.findById(pacienteId);

    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError(
        `Turno con id ${turnoId} no encontrado`,
        "TURNO_NO_ENCONTRADO",
      );
    }

    if (turno.estado !== EstadoTurno.DISPONIBLE) {
      throw new BadRequestError(
        `El turno no está disponible. Estado actual: ${turno.estado}`,
        "TURNO_NO_DISPONIBLE",
      );
    }

    turno.paciente = pacienteId;
    turno.actualizarEstado(
      EstadoTurno.RESERVADO,
      pacienteId,
      "Reserva por paciente",
    );

    const turnoGuardado = await this.turnoRepository.guardar(turno);

    const nombreServicio = turno.servicio?.servicioUnico?.nombre ?? turno.servicio?.nombre ?? "servicio no especificado";
    try {
      await this.notificacionesService.create({
        destinatario: turno.medico,
        remitente: pacienteId,
        mensaje: `El paciente ${paciente.nombre} reservó un turno para ${nombreServicio}.`,
      });
    } catch (notifErr) {
      console.error('[PacienteService] Error al enviar notificación de reserva:', notifErr.message);
    }

    return turnoGuardado;
  }

  async cancelarTurno(pacienteId, turnoId, motivo) {
    const paciente = await this.findById(pacienteId);

    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new NotFoundError(
        `Turno con id ${turnoId} no encontrado`,
        "TURNO_NO_ENCONTRADO",
      );
    }

    if (String(turno.paciente._id || turno.paciente) !== String(pacienteId)) {
      throw new BadRequestError(
        "No podés cancelar un turno que no te pertenece",
        "TURNO_AJENO",
      );
    }

    const estadosCancelables = [EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO];
    if (!estadosCancelables.includes(turno.estado)) {
      throw new BadRequestError(
        `No se puede cancelar un turno en estado ${turno.estado}`,
        "TURNO_NO_CANCELABLE",
      );
    }

    const minutosRestantes =
      (new Date(turno.fechaHora) - new Date()) / (1000 * 60);
    if (minutosRestantes < MINUTOS_MINIMOS_CANCELACION) {
      throw new BadRequestError(
        `Solo se puede cancelar con al menos ${MINUTOS_MINIMOS_CANCELACION} minutos de anticipación. ` +
          `Faltan ${Math.floor(minutosRestantes)} minutos para el turno.`,
        "CANCELACION_FUERA_DE_PLAZO",
      );
    }

    turno.actualizarEstado(EstadoTurno.CANCELADO, pacienteId, motivo);

    const turnoGuardado = await this.turnoRepository.guardar(turno);

    const nombreServicio = turno.servicio?.servicioUnico?.nombre ?? turno.servicio?.nombre ?? "servicio no especificado";
    try {
      await this.notificacionesService.create({
        destinatario: turno.medico,
        remitente: pacienteId,
        mensaje: `El paciente ${paciente.nombre} canceló el turno de ${nombreServicio}. Motivo: ${motivo}`,
      });
    } catch (notifErr) {
      console.error('[PacienteService] Error al enviar notificación de cancelación:', notifErr.message);
    }

    return turnoGuardado;
  }

  async solicitarCambioFecha(pacienteId, turnoActualId, nuevoTurnoId) {
    const paciente = await this.findById(pacienteId);

    const turnoActual = await this.turnoRepository.findById(turnoActualId);
    if (!turnoActual) {
      throw new NotFoundError(
        `Turno con id ${turnoActualId} no encontrado`,
        "TURNO_NO_ENCONTRADO",
      );
    }

    if (String(turnoActual.paciente) !== String(pacienteId)) {
      throw new BadRequestError(
        "No podés solicitar un cambio en un turno que no te pertenece",
        "TURNO_AJENO",
      );
    }

    const estadosCambiables = [EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO];
    if (!estadosCambiables.includes(turnoActual.estado)) {
      throw new BadRequestError(
        `No se puede solicitar cambio en un turno en estado ${turnoActual.estado}`,
        "TURNO_NO_CAMBIABLE",
      );
    }

    const nuevoTurno = await this.turnoRepository.findById(nuevoTurnoId);
    if (!nuevoTurno) {
      throw new NotFoundError(
        `Turno propuesto con id ${nuevoTurnoId} no encontrado`,
        "TURNO_NUEVO_NO_ENCONTRADO",
      );
    }
    if (nuevoTurno.estado !== EstadoTurno.DISPONIBLE) {
      throw new BadRequestError(
        `El turno propuesto no está disponible. Estado actual: ${nuevoTurno.estado}`,
        "TURNO_NUEVO_NO_DISPONIBLE",
      );
    }

    const solicitudExistenteOriginal = await this.solicitudCambioTurnoRepository.model.findOne({
      $or: [
        { turnoOriginal: turnoActualId, estado: "PENDIENTE" },
        { turnoNuevo: turnoActualId, estado: "PENDIENTE" }
      ]
    });
    if (solicitudExistenteOriginal) {
      throw new BadRequestError(
        "Ya existe una solicitud de cambio pendiente que involucra a este turno",
        "SOLICITUD_PENDIENTE"
      );
    }

    const solicitudExistenteNuevo = await this.solicitudCambioTurnoRepository.model.findOne({
      $or: [
        { turnoOriginal: nuevoTurnoId, estado: "PENDIENTE" },
        { turnoNuevo: nuevoTurnoId, estado: "PENDIENTE" }
      ]
    });
    if (solicitudExistenteNuevo) {
      throw new BadRequestError(
        "El turno propuesto ya está involucrado en otra solicitud de cambio pendiente",
        "SOLICITUD_PENDIENTE"
      );
    }

    turnoActual.actualizarEstado(
      EstadoTurno.RESERVADO,
      pacienteId,
      `Cambio solicitado hacia turno ${nuevoTurnoId}`,
    );
    turnoActual.turnoSugerido = nuevoTurnoId;

    nuevoTurno.paciente = pacienteId;
    nuevoTurno.actualizarEstado(
      EstadoTurno.RESERVADO,
      pacienteId,
      `Propuesto como cambio del turno ${turnoActualId}`,
    );

    const nuevaSolicitud = new SolicitudCambioTurno({
      turnoOriginalId: turnoActualId,
      turnoNuevoId: nuevoTurnoId,
      solicitanteId: pacienteId,
      pacienteId: pacienteId,
      medicoId: String(turnoActual.medico._id || turnoActual.medico),
      motivo: `Cambio de fecha solicitado por el paciente`,
    });

    const [turnoActualGuardado, nuevoTurnoGuardado, solicitudGuardada] =
      await Promise.all([
        this.turnoRepository.guardar(turnoActual),
        this.turnoRepository.guardar(nuevoTurno),
        this.solicitudCambioTurnoRepository.save(nuevaSolicitud),
      ]);

    const nombreServicio =
      turnoActual.servicio?.servicioUnico?.nombre ?? turnoActual.servicio?.nombre ?? "servicio no especificado";
    const fechaNueva = new Date(nuevoTurno.fechaHora).toLocaleString("es-AR");
    try {
      await this.notificacionesService.create({
        destinatario: turnoActual.medico,
        remitente: pacienteId,
        mensaje:
          `El paciente ${paciente.nombre} solicitó cambiar el turno de ${nombreServicio} ` +
          `para el ${fechaNueva}. Revisá la solicitud para aceptar o rechazar.`,
        tipo: "CAMBIO_TURNO",
        referenciaId: solicitudGuardada._id.toString(),
      });
    } catch (notifErr) {
      console.error('[PacienteService] Error al enviar notificación de solicitud de cambio:', notifErr.message);
    }

    return {
      turnoActual: turnoActualGuardado,
      nuevoTurno: nuevoTurnoGuardado,
      solicitud: solicitudGuardada,
    };
  }
}
