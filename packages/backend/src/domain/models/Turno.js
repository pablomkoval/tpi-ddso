import{EstadoTurno} from "domain/enum";
import{cambioEstadoTurno} from "domain/models";

export class Turno{

    historialEstados = [];
    //estado = disponible?
    // distintos tipos de dato, quiza otra forma de armarlo mas prolija
    constructor(id, medico, paciente, fechaHora, sede, practica, estado, costo){
        this.id = id; //id se le asigna o se genera segun una base de datos?       
        this.medico = medico;
        this.paciente = paciente;
        this.fechaHora = fechaHora;
        this.sede = sede;
        this.practica = practica;
        this.estado = estado;
        this.costo = costo;
    }

    actualizarEstado(nuevoEstado, quien, motivoCambio){
        this.estado = nuevoEstado; 
        const cambioEstado = /* ojo fechahoraingreso, y que estado se registra */
            new cambioEstadoTurno(fechaHoraIngeso = this.fechaHora, estado = nuevoEstado, turno = this, usuario = quien, motivo = motivoCambio);
        this.historialEstados.push(cambioEstado);
    }
}