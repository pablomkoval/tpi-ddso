/* import { Especialidad } from "./Especialidad";
import { Practica } from "./Practica"; */

export class Plan {
    constructor (nombre, cobEsp, cobPrac){
        this.nombre = nombre;
        this.coberturasEspecialidad = cobEsp;
        this.coberturasPractica = cobPrac;
    }
    /* obtenerCoberturaEspecialidad(especialidadId){ //recorrer las 2 listas para polimorfismo? por qué 2 métodos mismo nombre
        return this.coberturasEspecialidad.find(elem => elem.especialidad.equals(especialidadId))?.nivel;
    }
    obtenerCoberturaPractica(practicaId){
        return this.coberturasPractica.find(elem => elem.practica.id.equals(practicaId))?.nivel;
    }
 */
    obtenerCoberturaServicio(servicioId) {

    return (
        this.coberturasEspecialidad.find(
            elem => String(elem.servicio._id) === String(servicioId)
        ) ||
        this.coberturasPractica.find(
            elem => String(elem.servicio._id) === String(servicioId)
        )
    )?.nivel ?? null;
}

}