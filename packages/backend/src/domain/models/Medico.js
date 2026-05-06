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
        this.disponibilidades.push(disponibilidad);
    }

    //quitarDisponibilidad(disponibilidad)?

    prestaServicio(servicio){
        return this.especialidades.contains(servicio) || this.practicas.contains(servicio);
    }


}