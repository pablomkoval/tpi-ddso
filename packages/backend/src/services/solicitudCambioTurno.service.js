import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "../shared/errors/AppError.js";
import { EstadoSolicitudCambioTurno } from "../domain/enum/EstadoSolicitudCambioTurno.js";
import { SolicitudCambioTurno } from "../domain/models/entities/turnos/SolicitudCambioTurno.js";
import { EstadoTurno } from "../domain/enum/EstadoTurno.js";

export class SolicitudCambioTurnoService {
  constructor(solicitudCambioTurnoRepository, turnoRepository) {
    this.solicitudCambioTurnoRepository = solicitudCambioTurnoRepository;
    this.turnoRepository = turnoRepository;
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

    this.obtenerTipoSolicitante(turnoOriginal, solicitanteId);

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

    return await this.solicitudCambioTurnoRepository.save(solicitud);
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

    this.validarConfirmador(turnoOriginal, solicitud, confirmadorId);

    if (turnoNuevo.estado !== EstadoTurno.DISPONIBLE || turnoNuevo.paciente) {
      throw new ConflictError(
        "El nuevo turno ya no está disponible",
        "TURNO_NO_DISPONIBLE",
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

    this.validarConfirmador(turnoOriginal, solicitud, confirmadorId);

    solicitud.rechazar(confirmadorId, motivoRechazo);

    return await this.solicitudCambioTurnoRepository.update(
      solicitud.id || solicitud._id,
      {
        estado: solicitud.estado,
        confirmadorId: solicitud.confirmadorId,
        fechaResolucion: solicitud.fechaResolucion,
        motivoRechazo: solicitud.motivoRechazo,
      },
    );
  }

  validarConfirmador(turno, solicitud, confirmadorId) {
    const solicitanteTipo = this.obtenerTipoSolicitante(
      turno,
      solicitud.solicitanteId,
    );

    if (String(turno.medico) !== String(confirmadorId)) {
      throw new UnprocessableEntityError(
        "El confirmador no coincide con el médico del turno",
        "MEDICO_NO_AUTORIZADO",
      );
    }

    if (!turno.paciente) {
      throw new UnprocessableEntityError(
        "El turno no tiene paciente asociado",
        "TURNO_SIN_PACIENTE",
      );
    }
    if (String(turno.paciente) !== String(confirmadorId)) {
      throw new UnprocessableEntityError(
        "El confirmador no coincide con el paciente del turno",
        "PACIENTE_NO_AUTORIZADO",
      );
    }
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
