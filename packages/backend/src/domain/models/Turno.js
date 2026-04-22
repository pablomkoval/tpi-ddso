import{EstadoTurno} from "domain/enum";
import{cambioEstadoTurno} from "domain/models";

export class Turno{
    paciente;
    costo;
    sede;
    historialEstados = [];
    //estado = disponible?
    
    constructor(medico, fechaHora, servicio){
        this.id = "placeholder"; //id se le asigna o se genera segun una base de datos?       
        this.medico = medico;
        //paciente no se define al crear un turno, solo esta disponible
        this.fechaHora = fechaHora;
        //la sede no queda definida hasta que se confirme el turno (consultar)

        this.servicio = servicio; // servicio: especialidad o practica
        
        this.estado = EstadoTurno.DISPONIBLE;
        //sin paciente no hay costo aún
    }

    actualizarEstado(nuevoEstado, quien, motivoCambio){
        this.estado = nuevoEstado; 
        /* ojo fechahoraingreso, y que estado se registra */
        const cambioEstado = new cambioEstadoTurno(nuevoEstado, this, quien, motivoCambio);
        this.historialEstados.push(cambioEstado);
    }
}