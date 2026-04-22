import { Especialidad } from "./Especialidad";
import { Practica } from "./Practica";

export class Plan {
    constructor (id, nombre, cobEsp, cobPrac){
        this.id = id;
        this.nombre = nombre;
        this.coberturasEspecialidad = cobEsp;
        this.coberturasPractica = cobPrac;
    }
    obtenerCobertura(e){
        return this.coberturasEspecialidad.find(elem => elem.especialidad.id === e.id).nivel;
    }
    obtenerCoberturaPractica(p){
        return this.coberturasPractica.find(elem => elem.practica.id === p.id).nivel;
    }

}