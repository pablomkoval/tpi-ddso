import { EstadoSolicitudCambioTurno } from "../../../enum/EstadoSolicitudCambioTurno.js";

export class SolicitudCambioTurno {
  estado = EstadoSolicitudCambioTurno.PENDIENTE;
  fechaSolicitud = new Date();
  fechaResolucion = null;
  confirmadorId = null;
  motivo = null;
  motivoRechazo = null;

  constructor({
    turnoOriginalId,
    turnoNuevoId,
    solicitanteId,
    pacienteId,
    medicoId,
    motivo,
  }) {
    this.turnoOriginal = turnoOriginalId;
    this.turnoNuevo = turnoNuevoId;
    this.solicitanteId = solicitanteId;
    this.pacienteId = pacienteId;
    this.medicoId = medicoId;
    this.motivo = motivo ?? null;
  }

  confirmar(confirmadorId) {
    this.estado = EstadoSolicitudCambioTurno.ACEPTADA;
    this.confirmadorId = confirmadorId;
    this.fechaResolucion = new Date();
  }

  rechazar(confirmadorId, motivoRechazo) {
    this.estado = EstadoSolicitudCambioTurno.RECHAZADA;
    this.confirmadorId = confirmadorId;
    this.fechaResolucion = new Date();
    this.motivoRechazo = motivoRechazo ?? null;
  }
}
