import { EstadoTurno } from "../../../enum/EstadoTurno.js";
import { CambioEstadoTurno } from "./CambioEstadoTurno.js";

export class Turno {
  paciente = null;
  costo = null;
  sede = null;
  estado = EstadoTurno.DISPONIBLE;
  historialEstados = [];

  constructor(medico, fechaHora, servicio) {
    this.medico = medico;
    this.fechaHora = fechaHora;
    this.servicio = servicio;
  }

  actualizarEstado(nuevoEstado, quien, motivoCambio) {
    this.estado = nuevoEstado;
    // Le pasamos this.id en vez de this — evita la referencia circular
    const cambio = new CambioEstadoTurno(
      nuevoEstado,
      this.id ?? this._id,
      quien,
      motivoCambio,
    );
    this.historialEstados.push(cambio);
  }
}
