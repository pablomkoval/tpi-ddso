import { SedeNoAutorizadaError } from "../../errors/SedeNoAutorizadaError.js";
import { ServicioNoPrestadoError } from "../../errors/ServicioNoPrestadoError.js";
import { Turno } from "../turnos/Turno.js";

export class Medico{

    especialidades = [];
    practicas = [];
    sedes = [];
    disponibilidades = [];
    turnos = [];

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

    definirDisponibilidad(disponibilidad){
        // Validar que la sede de la disponibilidad corresponde con las sedes del médico
        const sedeValida = this.sedes.some(sede => sede.id === disponibilidad.sede.id);
        if (!sedeValida) {
            throw new SedeNoAutorizadaError(`La sede "${disponibilidad.sede.nombre}" no está autorizada para el médico "${this.nombre}"`);
        }
        this.disponibilidades.push(disponibilidad);
    }

    prestaServicio(servicio){
        return this.especialidades.some(especialidad => especialidad.esMismoServicioQue(servicio))
            || this.practicas.some(practica => practica.esMismoServicioQue(servicio));
    }

    generarTurnosPara(servicio, diasACubrir = 7){
        if (!this.prestaServicio(servicio)){
            throw new ServicioNoPrestadoError(`El médico "${this.nombre}" no presta el servicio "${servicio.nombre}"`);
        }
        const fechaInicio = new Date();
        const fechaFinal = new Date(fechaInicio);
        fechaFinal.setDate(fechaFinal.getDate() + diasACubrir);
        const duracionTurnoEnMins = servicio.obtenerDuracionTurnoEnMins();

        const siguienteFechaParaDia = (fechaBase, diaSemana) => {
            const fecha = new Date(fechaBase);
            const diff = (diaSemana - fecha.getDay() + 7) % 7;
            fecha.setDate(fecha.getDate() + diff);
            fecha.setHours(0, 0, 0, 0);
            return fecha;
        };

        this.disponibilidades.forEach(disponibilidad => {
            for (let fechaActual = siguienteFechaParaDia(fechaInicio, disponibilidad.diaSemana);
                fechaActual <= fechaFinal;
                fechaActual.setDate(fechaActual.getDate() + 7)) {

                const instantes = disponibilidad.generarInstantesTurnoParaFecha(fechaActual, duracionTurnoEnMins);
                for (const fechaHoraTurno of instantes) {
                    const turno = new Turno(this, fechaHoraTurno, servicio);
                    this.turnos.push(turno);
                }
            }
        });
    }

    obtenerTurnos(){
        return [...this.turnos];
    }

}