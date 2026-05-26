import { TipoServicio } from "../../../enum/TipoServicio";

export class Especialidad {
    id

    constructor(nombre, duracionTurnoEnMins, costoConsulta) {
        this.id = "placeholder";
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costoConsulta = costoConsulta;
        this.tipoServicio = TipoServicio.ESPECIALIDAD
    }


    esMismoServicioQue(otroServicio) {
        if (!otroServicio) {
            return false;
        }
        if (this === otroServicio) {
            return true;
        }
        if (this.id && this.id !== "placeholder" && otroServicio.id && otroServicio.id !== "placeholder") {
            return this.id === otroServicio.id;
        }
        return this.nombre === otroServicio.nombre;
    }
}