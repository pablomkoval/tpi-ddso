/* import { Especialidad } from "./Especialidad";
import { Practica } from "./Practica"; */

export class Plan {
    constructor (nombre, cobEsp, cobPrac){
        this.nombre = nombre;
        this.coberturasEspecialidad = cobEsp;
        this.coberturasPractica = cobPrac;
    }
    obtenerCoberturaEspecialidad(e){ //recorrer las 2 listas para polimorfismo? por qué 2 métodos mismo nombre
        return this.coberturasEspecialidad.find(elem => elem.especialidad.id === e.id).nivel;
    }
    obtenerCoberturaPractica(p){
        return this.coberturasPractica.find(elem => elem.practica.id === p.id).nivel;
    }

}