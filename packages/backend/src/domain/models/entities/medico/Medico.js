import { SedeNoAutorizadaError } from "../../../errors/SedeNoAutorizadaError.js";
import { ServicioNoPrestadoError } from "../../../errors/ServicioNoPrestadoError.js";
import { Turno } from "../turnos/Turno.js";

export class Medico {

    especialidades = [];
    practicas = [];
    sedes = [];
    disponibilidades = [];
    turnos = [];

    constructor(usuario, matricula, nombre) {
        this.id = "placeholder";
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;

    }

    agregarEspecialidad(nuevaEspecialidad) {
        this.especialidades.push(nuevaEspecialidad);
    }

    agregarPractica(nuevaPractica) {
        this.practicas.push(nuevaPractica);
    }

    agregarSede(nuevaSede) {
        this.sedes.push(nuevaSede);
    }

    definirDisponibilidad(disponibilidad) {
        // Validar que la sede de la disponibilidad corresponde con las sedes del médico
        const sedeValida = this.sedes.some(sede => sede.id === disponibilidad.sede.id);
        if (!sedeValida) {
            throw new SedeNoAutorizadaError(`La sede "${disponibilidad.sede.nombre}" no está autorizada para el médico "${this.nombre}"`);
        }
        this.disponibilidades.push(disponibilidad);
    }

    prestaServicio(servicio) {
        return this.especialidades.some(especialidad => especialidad.esMismoServicioQue(servicio))
            || this.practicas.some(practica => practica.esMismoServicioQue(servicio));
    }

    tieneTurnoEn(fechaHora) {
        return this.turnos.some(turno => turno.fechaHora.getTime() === fechaHora.getTime());
    }

    generarTurnosPara(servicio, diasACubrir = 7) {
        if (!this.prestaServicio(servicio)) {
            throw new ServicioNoPrestadoError(`El médico "${this.nombre}" no presta el servicio "${servicio.nombre}"`);
        }
        const fechaInicio = new Date();
        const fechaFinal = new Date(fechaInicio);
        fechaFinal.setDate(fechaFinal.getDate() + diasACubrir);
        const duracionTurnoEnMins = servicio.duracionTurnoEnMins;

        const siguienteFechaParaDia = (fechaBase, diaSemana) => {
            const fecha = new Date(fechaBase);
            const diff = (diaSemana - fecha.getDay() + 7) % 7;
            fecha.setDate(fecha.getDate() + diff);
            fecha.setHours(0, 0, 0, 0);
            return fecha;
        };

        const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;
        for (const disponibilidad of this.disponibilidades) {
            for (let fechaActual = siguienteFechaParaDia(fechaInicio, disponibilidad.diaSemana);
                fechaActual <= fechaFinal;
                fechaActual = new Date(fechaActual.getTime() + SEMANA_MS)) {

                const instantes = disponibilidad.generarInstantesTurnoParaFecha(fechaActual, duracionTurnoEnMins);
                for (const fechaHoraTurno of instantes) {
                    if (this.tieneTurnoEn(fechaHoraTurno)) {
                        continue;
                    }
                    const turno = new Turno(this, fechaHoraTurno, servicio);
                    this.turnos.push(turno);
                }
            }
        }
    }

    obtenerTurnos() {
        return [...this.turnos];
    }

}