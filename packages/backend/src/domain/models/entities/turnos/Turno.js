import { EstadoTurno } from "../../../enum/EstadoTurno.js";
import { CambioEstadoTurno } from "./CambioEstadoTurno.js";

export class Turno{
    paciente;
    costo;
    sede;
    estado = EstadoTurno.DISPONIBLE;
    historialEstados = [];
    //estado = disponible?
    
    constructor(medico, fechaHora, servicio){
        this.id = "placeholder"; //id se le asigna o se genera segun una base de datos?       
        this.medico = medico;
        //paciente no se define al crear un turno, solo esta disponible
        this.fechaHora = fechaHora;
        //la sede no queda definida hasta que se confirme el turno (consultar)

        this.servicio = servicio; // servicio: especialidad o practica
        
        this.actualizarEstado(EstadoTurno.DISPONIBLE, "SYSTEM", "Generación automática de turno");
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