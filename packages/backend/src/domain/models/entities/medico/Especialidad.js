export class Especialidad{
    constructor(nombre, duracionTurnoEnMins, costoConsulta){
        this.id = "placeholder";
        this.nombre = nombre;
        this.duracionTurnoEnMins = duracionTurnoEnMins;
        this.costoConsulta = costoConsulta;
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
        return this.nombre === otroServicio.nombre;
    }
}