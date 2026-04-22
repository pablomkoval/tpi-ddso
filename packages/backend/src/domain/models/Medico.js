export class Medico{

    constructor(id, usuario, matricula, nombre){
        this.id = id;
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;

        this.especialidades = [];
        this.practicas = [];
        this.sedes = [];
        this.disponibilidades = [];
    }

    agregarEspescialidad (nuevaEspecialidad){
        this.especialidades.push(nuevaEspecialidad);
    }

    agregarPractica(nuevaPractica){
        this.practicas.push(nuevaPractica);
    }

    agregarSede(nuevaSede){
        this.sedes.push(nuevaSede);
    }

    definirDisponibilidad(disponibilidad){ //no saca tambien disponibilidad?
        this.disponibilidades.push(disponibilidad);
    }

    prestaServicio(criterio){
        return this.especialidades.contains(criterio) || this.practicas.contains(criterio);
    }


}