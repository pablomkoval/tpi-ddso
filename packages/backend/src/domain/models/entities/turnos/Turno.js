import { EstadoTurno } from "../../../enum/EstadoTurno.js";
import { CambioEstadoTurno } from "./CambioEstadoTurno.js";

export class Turno{
    paciente;
    costo;
    sede;
    estado = EstadoTurno.DISPONIBLE;
    historialEstados = [];
    //estado = disponible?
    
    constructor(medico, fechaHora, servicio, sede){
        this.id = "placeholder"; //id se le asigna o se genera segun una base de datos?       
        this.medico = medico;
        //paciente no se define al crear un turno, solo esta disponible
        this.fechaHora = fechaHora;
        this.sede = sede;

        this.servicio = servicio; // servicio: especialidad o practica
        
        //estado comienza disponible
        //sin paciente no hay costo aún
    }

    actualizarEstado(nuevoEstado, quien, motivoCambio){
        this.estado = nuevoEstado; 
        /* ojo fechahoraingreso, y que estado se registra */
        const cambioEstado = new CambioEstadoTurno(nuevoEstado, this, quien, motivoCambio);
        this.historialEstados.push(cambioEstado);
    }
}