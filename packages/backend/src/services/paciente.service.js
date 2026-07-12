import { BadRequestError, NotFoundError } from "../shared/errors/AppError.js";
import { EstadoTurno } from "../domain/enum/EstadoTurno.js";
import { SolicitudCambioTurno } from "../domain/models/entities/turnos/SolicitudCambioTurno.js";
import { TipoNotificacion } from "../domain/models/entities/turnos/Notificacion.js";

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

  async solicitarCambioFecha(pacienteId, turnoActualId, nuevoTurnoId) {
    await this.findById(pacienteId);

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
      const origDoc = await this.turnoRepository.findById(solicitudExistenteOriginal.turnoOriginal);
      const nuevoDoc = await this.turnoRepository.findById(solicitudExistenteOriginal.turnoNuevo);
      const estadosActivos = [EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO];

      if (
        origDoc && estadosActivos.includes(origDoc.estado) &&
        nuevoDoc && [EstadoTurno.DISPONIBLE, EstadoTurno.RESERVADO].includes(nuevoDoc.estado)
      ) {
        throw new BadRequestError(
          "Ya existe una solicitud de cambio pendiente que involucra a este turno",
          "SOLICITUD_PENDIENTE"
        );
      } else {
        // Auto-limpieza de solicitudes obsoletas
        solicitudExistenteOriginal.estado = "RECHAZADA";
        solicitudExistenteOriginal.motivoRechazo = "Cancelada automáticamente por inconsistencia de estados";
        await this.solicitudCambioTurnoRepository.update(solicitudExistenteOriginal.id || solicitudExistenteOriginal._id, {
          estado: solicitudExistenteOriginal.estado,
          motivoRechazo: solicitudExistenteOriginal.motivoRechazo,
          fechaResolucion: new Date()
        });
      }
    }

    const solicitudExistenteNuevo = await this.solicitudCambioTurnoRepository.model.findOne({
      $or: [
        { turnoOriginal: nuevoTurnoId, estado: "PENDIENTE" },
        { turnoNuevo: nuevoTurnoId, estado: "PENDIENTE" }
      ]
    });
    if (solicitudExistenteNuevo) {
      const origDoc = await this.turnoRepository.findById(solicitudExistenteNuevo.turnoOriginal);
      const nuevoDoc = await this.turnoRepository.findById(solicitudExistenteNuevo.turnoNuevo);
      const estadosActivos = [EstadoTurno.RESERVADO, EstadoTurno.CONFIRMADO];

      if (
        origDoc && estadosActivos.includes(origDoc.estado) &&
        nuevoDoc && [EstadoTurno.DISPONIBLE, EstadoTurno.RESERVADO].includes(nuevoDoc.estado)
      ) {
        throw new BadRequestError(
          "El turno propuesto ya está involucrado en otra solicitud de cambio pendiente",
          "SOLICITUD_PENDIENTE"
        );
      } else {
        // Auto-limpieza de solicitudes obsoletas
        solicitudExistenteNuevo.estado = "RECHAZADA";
        solicitudExistenteNuevo.motivoRechazo = "Cancelada automáticamente por inconsistencia de estados";
        await this.solicitudCambioTurnoRepository.update(solicitudExistenteNuevo.id || solicitudExistenteNuevo._id, {
          estado: solicitudExistenteNuevo.estado,
          motivoRechazo: solicitudExistenteNuevo.motivoRechazo,
          fechaResolucion: new Date()
        });
      }
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

    try {
      await this.notificacionesService.create({
        destinatario: turnoActual.medico,
        remitente: pacienteId,
        mensaje: "El paciente solicitó un cambio de turno. Revisá la solicitud para aceptarla o rechazarla.",
        tipo: TipoNotificacion.SOLICITUD_CAMBIO,
        referenciaId: solicitudGuardada.id || solicitudGuardada._id,
      });
    } catch (notifError) {
      console.error("[PacienteService] Error al enviar notificación tras crear propuesta de cambio:", notifError);
    }

    return {
      turnoActual: turnoActualGuardado,
      nuevoTurno: nuevoTurnoGuardado,
      solicitud: solicitudGuardada,
    };
  }
}
