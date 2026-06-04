import { EstadoTurno } from "../../../enum/EstadoTurno.js";
import { CambioEstadoTurno } from "./CambioEstadoTurno.js";

export class Turno {
  paciente;
  costo;
  sede;
  estado = EstadoTurno.DISPONIBLE;
  historialEstados = [];

  constructor(medico, fechaHora, servicio, sede, disponibilidadOrigen) {
    this.id = "placeholder";
    this.medico = medico;
    //paciente no se define al crear un turno, solo esta disponible
    this.fechaHora = fechaHora;
    this.sede = sede;
    this.disponibilidadOrigen = disponibilidadOrigen;

    this.servicio = servicio; // servicio: especialidad o practica

    this.actualizarEstado(EstadoTurno.DISPONIBLE, "SYSTEM", "Generación automática de turno");
    //estado comienza disponible
    //sin paciente no hay costo aún
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
