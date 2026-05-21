import { SedeNoAutorizadaError } from "../../errors/SedeNoAutorizadaError.js";

export class Medico{

    especialidades = [];
    practicas = [];
    sedes = [];
    disponibilidades = [];

    constructor(usuario, matricula, nombre){
        this.id = "placeholder";
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;

    }

    agregarEspecialidad (nuevaEspecialidad){
        this.especialidades.push(nuevaEspecialidad);
    }

    agregarPractica(nuevaPractica){
        this.practicas.push(nuevaPractica);
    }

    agregarSede(nuevaSede){
        this.sedes.push(nuevaSede);
    }

    definirDisponibilidad(disponibilidad){ //no saca tambien disponibilidad?
        // Validar que la sede de la disponibilidad corresponde con las sedes del médico
        const sedeValida = this.sedes.some(sede => sede.id === disponibilidad.sede.id);
        if (!sedeValida) {
            throw new SedeNoAutorizadaError(`La sede "${disponibilidad.sede.nombre}" no está autorizada para el médico "${this.nombre}"`);
        }
        this.disponibilidades.push(disponibilidad);
    }

    //quitarDisponibilidad(disponibilidad)?

    prestaServicio(servicio){
        return this.especialidades.contains(servicio) || this.practicas.contains(servicio);
    }


}