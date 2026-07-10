import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../shared/errors/AppError.js";
import { EstadoSolicitudCambioTurno } from "../domain/enum/EstadoSolicitudCambioTurno.js";
import { SolicitudCambioTurno } from "../domain/models/entities/turnos/SolicitudCambioTurno.js";
import { EstadoTurno } from "../domain/enum/EstadoTurno.js";
import { PacienteModel } from "../schemas/paciente.schema.js";
import { MedicoModel } from "../schemas/medico.schema.js";

export class SolicitudCambioTurnoService {
  constructor(solicitudCambioTurnoRepository, turnoRepository, notificacionesService) {
    this.solicitudCambioTurnoRepository = solicitudCambioTurnoRepository;
    this.turnoRepository = turnoRepository;
    this.notificacionesService = notificacionesService;
  }

  async obtenerPorId(id) {
    const solicitud = await this.solicitudCambioTurnoRepository.findById(id);
    if (!solicitud) {
      throw new NotFoundError(
        "Solicitud de cambio no encontrada",
        "SOLICITUD_NO_ENCONTRADA",
      );
    }
    return solicitud;
  }

  async solicitarCambio(data) {
    const { turnoId, nuevoTurnoId, solicitanteId, motivo } = data;

    if (String(turnoId) === String(nuevoTurnoId)) {
      throw new ConflictError(
        "El nuevo turno debe ser distinto al actual",
        "TURNO_IGUAL",
      );
    }

    const turnoOriginal = await this.turnoRepository.findById(turnoId);
    if (!turnoOriginal) {
      throw new NotFoundError("Turno no encontrado", "TURNO_NO_ENCONTRADO");
    }

    if (!turnoOriginal.paciente) {
      throw new UnprocessableEntityError(
        "El turno no tiene paciente asociado",
        "TURNO_SIN_PACIENTE",
      );
    }

    await this.obtenerTipoSolicitante(turnoOriginal, solicitanteId);

    const turnoNuevo = await this.turnoRepository.findById(nuevoTurnoId);
    if (!turnoNuevo) {
      throw new NotFoundError(
        "Nuevo turno no encontrado",
        "NUEVO_TURNO_NO_ENCONTRADO",
      );
    }

    if (String(turnoNuevo.medico) !== String(turnoOriginal.medico)) {
      throw new UnprocessableEntityError(
        "El nuevo turno debe ser del mismo médico",
        "MEDICO_NO_COINCIDE",
      );
    }

    // Validar que ambos turnos correspondan al mismo servicio/especialidad
    const idServicioOriginal = String(
      turnoOriginal.servicio?._id || turnoOriginal.servicio
    );
    const idServicioNuevo = String(
      turnoNuevo.servicio?._id || turnoNuevo.servicio
    );
    if (idServicioOriginal !== idServicioNuevo) {
      throw new UnprocessableEntityError(
        "El nuevo turno debe ser de la misma especialidad o práctica que el turno original",
        "SERVICIO_NO_COINCIDE",
      );
    }

    if (turnoNuevo.estado !== EstadoTurno.DISPONIBLE || turnoNuevo.paciente) {
      throw new ConflictError(
        "El nuevo turno no está disponible",
        "TURNO_NO_DISPONIBLE",
      );
    }

    const existente =
      await this.solicitudCambioTurnoRepository.findPendienteByTurnoOriginal(
        turnoId,
      );
    if (existente) {
      throw new ConflictError(
        "Ya existe una solicitud pendiente para este turno",
        "SOLICITUD_PENDIENTE",
      );
    }

    const solicitud = new SolicitudCambioTurno({
      turnoOriginalId: turnoId,
      turnoNuevoId: nuevoTurnoId,
      solicitanteId,
      pacienteId: String(turnoOriginal.paciente),
      medicoId: String(turnoOriginal.medico),
      motivo,
    });

    const solicitudGuardada = await this.solicitudCambioTurnoRepository.save(solicitud);

    // Actualizar estados de los turnos en la base de datos
    turnoOriginal.actualizarEstado(
      turnoOriginal.estado,
      solicitanteId,
      `Propuesta de cambio hacia el turno ${nuevoTurnoId}`,
    );
    turnoOriginal.turnoSugerido = nuevoTurnoId;
    await this.turnoRepository.guardar(turnoOriginal);

    turnoNuevo.paciente = turnoOriginal.paciente;
    turnoNuevo.actualizarEstado(
      EstadoTurno.RESERVADO,
      solicitanteId,
      `Propuesto como cambio del turno ${turnoId}`,
    );
    await this.turnoRepository.guardar(turnoNuevo);

    // Enviar notificación al paciente
    try {
      const docMedico = await MedicoModel.findById(turnoOriginal.medico);
      const nombreMedico = docMedico ? docMedico.nombre : "Médico";
      const fechaNueva = new Date(turnoNuevo.fechaHora).toLocaleString("es-AR");

      await this.notificacionesService.create({
        destinatario: String(turnoOriginal.paciente),
        remitente: String(turnoOriginal.medico),
        mensaje: `El médico ${nombreMedico} propuso cambiar tu turno para el ${fechaNueva}. Revisá la solicitud para aceptar o rechazar.`,
        tipo: "CAMBIO_TURNO",
        referenciaId: String(solicitudGuardada.id || solicitudGuardada._id),
      });
    } catch (notifError) {
      console.error("Error al enviar notificación tras crear propuesta de cambio:", notifError);
    }

    return solicitudGuardada;
  }

  async listarPorPaciente(pacienteId, page, limit) {
    return await this.solicitudCambioTurnoRepository.findAllPaginated(
      { pacienteId: String(pacienteId) },
      page,
      limit,
    );
  }

  async listarPorMedico(medicoId, page, limit) {
    return await this.solicitudCambioTurnoRepository.findAllPaginated(
      { medicoId: String(medicoId) },
      page,
      limit,
    );
  }

  async confirmarSolicitud(id, confirmadorId) {
    const solicitud = await this.obtenerSolicitudPendiente(id);

    const turnoOriginal = await this.turnoRepository.findById(
      solicitud.turnoOriginal,
    );
    if (!turnoOriginal) {
      throw new NotFoundError(
        "Turno original no encontrado",
        "TURNO_NO_ENCONTRADO",
      );
    }

    const turnoNuevo = await this.turnoRepository.findById(
      solicitud.turnoNuevo,
    );
    if (!turnoNuevo) {
      throw new NotFoundError(
        "Nuevo turno no encontrado",
        "NUEVO_TURNO_NO_ENCONTRADO",
      );
    }

    await this.validarConfirmador(turnoOriginal, solicitud, confirmadorId);

    const solicitanteTipo = await this.obtenerTipoSolicitante(turnoOriginal, solicitud.solicitanteId);

    if (
      turnoNuevo.estado !== EstadoTurno.RESERVADO ||
      String(turnoNuevo.paciente._id || turnoNuevo.paciente) !== String(solicitud.pacienteId)
    ) {
      throw new ConflictError(
        "El nuevo turno ya no está reservado para esta solicitud",
        "TURNO_NO_RESERVADO",
      );
    }

    const pacienteId = turnoOriginal.paciente;

    turnoOriginal.paciente = null;
    turnoOriginal.actualizarEstado(
      EstadoTurno.DISPONIBLE,
      confirmadorId,
      "Cambio de turno confirmado",
    );
    await turnoOriginal.save();

    turnoNuevo.paciente = pacienteId;
    turnoNuevo.actualizarEstado(
      EstadoTurno.CONFIRMADO,
      confirmadorId,
      "Turno reprogramado",
    );
    await turnoNuevo.save();

    solicitud.confirmar(confirmadorId);

    const actualizada = await this.solicitudCambioTurnoRepository.update(
      solicitud.id || solicitud._id,
      {
        estado: solicitud.estado,
        confirmadorId: solicitud.confirmadorId,
        fechaResolucion: solicitud.fechaResolucion,
      },
    );

    // Enviar notificación al otro participante
    try {
      const docPaciente = await PacienteModel.findById(solicitud.pacienteId);
      const nombrePaciente = docPaciente ? docPaciente.nombre : "Paciente";
      const fechaNueva = new Date(turnoNuevo.fechaHora).toLocaleString("es-AR");

      if (solicitanteTipo === "PACIENTE") {
        await this.notificacionesService.create({
          destinatario: solicitud.pacienteId,
          remitente: solicitud.medicoId,
          mensaje: `Tu solicitud de cambio de turno fue aceptada por el médico. Nuevo turno: ${fechaNueva}.`,
          tipo: "INFO",
          referenciaId: String(solicitud.id || solicitud._id)
        });
      } else {
        await this.notificacionesService.create({
          destinatario: solicitud.medicoId,
          remitente: solicitud.pacienteId,
          mensaje: `El paciente ${nombrePaciente} aceptó tu propuesta de cambio de turno para el ${fechaNueva}.`,
          tipo: "INFO",
          referenciaId: String(solicitud.id || solicitud._id)
        });
      }
    } catch (notifError) {
      console.error("Error al enviar notificación tras confirmar cambio de turno:", notifError);
    }

    return actualizada;
  }

  async rechazarSolicitud(id, confirmadorId, motivoRechazo) {
    const solicitud = await this.obtenerSolicitudPendiente(id);

    const turnoOriginal = await this.turnoRepository.findById(
      solicitud.turnoOriginal,
    );
    if (!turnoOriginal) {
      throw new NotFoundError(
        "Turno original no encontrado",
        "TURNO_NO_ENCONTRADO",
      );
    }

    await this.validarConfirmador(turnoOriginal, solicitud, confirmadorId);

    const turnoNuevo = await this.turnoRepository.findById(
      solicitud.turnoNuevo,
    );
    if (turnoNuevo) {
      turnoNuevo.paciente = null;
      turnoNuevo.actualizarEstado(
        EstadoTurno.DISPONIBLE,
        confirmadorId,
        "Solicitud de cambio rechazada",
      );
      await this.turnoRepository.update(turnoNuevo.id || turnoNuevo._id, turnoNuevo);
    }

    solicitud.rechazar(confirmadorId, motivoRechazo);

    const actualizada = await this.solicitudCambioTurnoRepository.update(
      solicitud.id || solicitud._id,
      {
        status: "success",
        estado: solicitud.estado,
        confirmadorId: solicitud.confirmadorId,
        fechaResolucion: solicitud.fechaResolucion,
        motivoRechazo: solicitud.motivoRechazo,
      },
    );

    // Enviar notificación al otro participante
    try {
      const docPaciente = await PacienteModel.findById(solicitud.pacienteId);
      const nombrePaciente = docPaciente ? docPaciente.nombre : "Paciente";
      const solicitanteTipo = await this.obtenerTipoSolicitante(turnoOriginal, solicitud.solicitanteId);

      if (solicitanteTipo === "PACIENTE") {
        await this.notificacionesService.create({
          destinatario: solicitud.pacienteId,
          remitente: solicitud.medicoId,
          mensaje: `Tu solicitud de cambio de turno fue rechazada por el médico. Motivo: ${motivoRechazo || "No especificado"}.`,
          tipo: "INFO",
          referenciaId: String(solicitud.id || solicitud._id)
        });
      } else {
        await this.notificacionesService.create({
          destinatario: solicitud.medicoId,
          remitente: solicitud.pacienteId,
          mensaje: `El paciente rechazó tu propuesta de cambio de turno. Motivo: ${motivoRechazo || "No especificado"}.`,
          tipo: "INFO",
          referenciaId: String(solicitud.id || solicitud._id)
        });
      }
    } catch (notifError) {
      console.error("Error al enviar notificación tras rechazar cambio de turno:", notifError);
    }

    return actualizada;
  }

  async validarConfirmador(turno, solicitud, confirmadorId) {
    const solicitanteTipo = await this.obtenerTipoSolicitante(
      turno,
      solicitud.solicitanteId,
    );

    const idPaciente = String(turno.paciente?._id || turno.paciente || '');
    const idMedico = String(turno.medico?._id || turno.medico || '');
    const idConfirmador = String(confirmadorId);

    const docPaciente = await PacienteModel.findById(idPaciente);
    const docMedico = await MedicoModel.findById(idMedico);

    const userPacienteId = docPaciente ? String(docPaciente.usuario) : null;
    const userMedicoId = docMedico ? String(docMedico.usuario) : null;

    if (solicitanteTipo === "PACIENTE") {
      const esMedicoDirecto = idConfirmador === idMedico;
      const esMedicoUsuario = userMedicoId && idConfirmador === userMedicoId;
      if (!esMedicoDirecto && !esMedicoUsuario) {
        throw new UnprocessableEntityError(
          "El confirmador no coincide con el médico del turno",
          "MEDICO_NO_AUTORIZADO",
        );
      }
    } else {
      const esPacienteDirecto = idConfirmador === idPaciente;
      const esPacienteUsuario = userPacienteId && idConfirmador === userPacienteId;
      if (!esPacienteDirecto && !esPacienteUsuario) {
        throw new UnprocessableEntityError(
          "El confirmador no coincide con el paciente del turno",
          "PACIENTE_NO_AUTORIZADO",
        );
      }
    }
  }

  async obtenerTipoSolicitante(turno, solicitanteId) {
    const idPaciente = String(turno.paciente?._id || turno.paciente || '');
    const idMedico = String(turno.medico?._id || turno.medico || '');
    const idSolicitante = String(solicitanteId);

    if (idSolicitante === idPaciente) {
      return "PACIENTE";
    }
    if (idSolicitante === idMedico) {
      return "MEDICO";
    }

    const docPaciente = await PacienteModel.findById(idPaciente);
    const docMedico = await MedicoModel.findById(idMedico);

    if (docPaciente && idSolicitante === String(docPaciente.usuario)) {
      return "PACIENTE";
    }
    if (docMedico && idSolicitante === String(docMedico.usuario)) {
      return "MEDICO";
    }

    throw new UnprocessableEntityError(
      "El solicitante no pertenece al turno original o no está autorizado",
      "SOLICITANTE_NO_AUTORIZADO",
    );
  }

  async obtenerSolicitudPendiente(id) {
    const solicitud = await this.solicitudCambioTurnoRepository.findById(id);
    if (!solicitud) {
      throw new NotFoundError(
        "Solicitud de cambio no encontrada",
        "SOLICITUD_NO_ENCONTRADA",
      );
    }
    if (solicitud.estado !== EstadoSolicitudCambioTurno.PENDIENTE) {
      throw new ConflictError(
        "La solicitud ya fue resuelta",
        "SOLICITUD_NO_PENDIENTE",
      );
    }
    return solicitud;
  }
}
