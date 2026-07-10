/* import { date } from "zod";
 */
export class CambioEstadoTurno{

    constructor (estado, turno, usuario, motivo){
        this.fechaHoraCambio = new Date();
        this.estado = estado;
        this.turno = turno; //por que conoce el turno (?)
        this.usuario = usuario;
        this.motivoCambio = motivo;
    }
}
