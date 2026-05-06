import { date } from "zod";

class CambioEstadoTurno{

    constructor (estado, turno, usuario, motivo){
        this.fechaHoraIngreso = new Date();
        this.estado = estado;
        this.turno = turno; //por que conoce el turno (?)
        this.usuario = usuario;
        this.motivo = motivo;
    }
}