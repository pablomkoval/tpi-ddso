import { Especialidad } from "./Especialidad";
import { Practica } from "./Practica";

export class Plan {
    constructor (id, nombre, cobEsp, cobPrac){
        this.id = id;
        this.nombre = nombre;
        this.coberturasEspecialidad = cobEsp;
        this.coberturasPractica = cobPrac;
    }
    obtenerCobertura(obj){
        if(obj instanceof Especialidad){
            return this.coberturasEspecialidad.find(elem => elem.especialidad.id === obj.id).nivel;
        } else if(obj instanceof Practica){
            return this.coberturasPractica.find(elem => elem.practica.id === obj.id).nivel;
        }else{
            //TODO: tirar error
        }
        
    }

}