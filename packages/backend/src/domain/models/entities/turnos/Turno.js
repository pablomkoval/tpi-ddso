import { EstadoTurno } from "../../../enum/EstadoTurno.js";
import { CambioEstadoTurno } from "./CambioEstadoTurno.js";

export class Turno {
  paciente;
  costo;
  sede;
  estado = EstadoTurno.DISPONIBLE;
  historialEstados = [];

  constructor(medico, fechaHora, servicio, sede, disponibilidadOrigen) {
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

    if (!this.esEstadoValido(nuevoEstado)) {
      throw new Error(`Estado no válido: ${nuevoEstado}`);
    }
    
    this.estado = nuevoEstado;
    // Le pasamos this.id en vez de this — evita la referencia circular
    const cambio = new CambioEstadoTurno(
      nuevoEstado,
      this._id,
      quien,
      motivoCambio,
    );
    this.historialEstados.push(cambio);
  }

  esEstadoValido(estado) {
    if (estado === this.estado) return true;
    if (this.historialEstados.length === 0) {
      return estado === EstadoTurno.DISPONIBLE;
    }

    switch (this.estado) {
      case EstadoTurno.DISPONIBLE:
        return [EstadoTurno.RESERVADO].includes(estado);

      case EstadoTurno.RESERVADO:
        return [EstadoTurno.CONFIRMADO, EstadoTurno.CANCELADO, EstadoTurno.DISPONIBLE].includes(estado);

      case EstadoTurno.CONFIRMADO:
        return [EstadoTurno.REALIZADO, EstadoTurno.CANCELADO, EstadoTurno.DISPONIBLE, EstadoTurno.RESERVADO].includes(estado);
      //cancelado se toma que no podria volver a ser un turno disponible
      default:
        return false;
    }
  }



}
