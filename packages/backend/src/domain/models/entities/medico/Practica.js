export class Practica{

    constructor(codigo, nombre, duracionTurnoEnMins, costo){
        this.id = "placeholder";
        this.codigo = codigo; //diferencia código, id y nombre?
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costo = costo;
    }

    obtenerDuracionTurnoEnMins(){
        return this.duracionTurnoEnMins;
    }

    esMismoServicioQue(otroServicio){
        if (!otroServicio) {
            return false;
        }
        if (this === otroServicio) {
            return true;
        }
        if (this.id && this.id !== "placeholder" && otroServicio.id && otroServicio.id !== "placeholder") {
            return this.id === otroServicio.id;
        }
        return this.codigo === otroServicio.codigo;
    }
}