import { date } from "zod";

class CambioEstadoTurno{

    constructor (estado, turno, usuario, motivo){
        this.fechaHoraIngreso = new date;
        this.estado = estado;
        this.turno = turno; //por que conoce el turno (?)
        this.usuario = usuario;
        this.motivo = motivo;
    }
}