import { SedeNoAutorizadaError } from "../../../errors/SedeNoAutorizadaError.js";
import { ServicioNoPrestadoError } from "../../../errors/ServicioNoPrestadoError.js";
import { DisponibilidadHoraria } from "./DisponibilidadHoraria.js";
import { Turno } from "../turnos/Turno.js";

export default class Medico {
    disponibilidades = [];
    turnos = [];

    constructor(usuario, matricula, nombre, especialidades = [], practicas = [], sedes = [], disponibilidades = []) {
        this.id = "placeholder";
        this.usuario = usuario;
        this.matricula = matricula;
        this.nombre = nombre;
        this.especialidades = especialidades;
        this.practicas = practicas;
        this.sedes = sedes;
        this.disponibilidades = this.validarDisponibilidades(disponibilidades);
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

    validarDisponibilidad(disponibilidad) {
        const nuevaDisponibilidad = new DisponibilidadHoraria({
            id: disponibilidad.id,
            diaSemana: disponibilidad.diaSemana,
            horaDesde: disponibilidad.horaDesde,
            horaHasta: disponibilidad.horaHasta,
            sede: disponibilidad.sede,
            servicioMedico: disponibilidad.servicioMedico
        });
    
        // Validar que la sede de la disponibilidad esté autorizada para el médico
        const sedeValida = this.sedes.some(sede => sede.id === nuevaDisponibilidad.sede.id);
        if (!sedeValida) {
            throw new SedeNoAutorizadaError(`La sede "${nuevaDisponibilidad.sede.nombre}" no está autorizada para el médico "${this.nombre}"`);
        }

        // Validar que la nueva disponibilidad no se solape con las existentes
        if (this.disponibilidades.some(d => {
                const disponibilidadVieja = new DisponibilidadHoraria({
                    id: d.id,
                    diaSemana: d.diaSemana, 
                    horaDesde: d.horaDesde,
                    horaHasta: d.horaHasta, 
                    sede: d.sede,
                    servicioMedico: d.servicioMedico
                });
                return nuevaDisponibilidad.seSolapaCon(disponibilidadVieja);
            })
        ) {
            throw new Error("La disponibilidad se solapa con una existente");
        }

        return nuevaDisponibilidad;
    }

    validarDisponibilidades(disponibilidades) {
        return disponibilidades.map(d => this.validarDisponibilidad(d));
    }

    agregarDisponibilidades(nuevasDisponibilidades) {
        const disponibilidadesValidadas = this.validarDisponibilidades(nuevasDisponibilidades);
        disponibilidadesValidadas.forEach(nuevaDisponibilidad => this.disponibilidades.push(nuevaDisponibilidad));
    }

    editarDisponibilidad(disponibilidadId, cambios) {
        const index = this.disponibilidades.findIndex(d => d.id === disponibilidadId);
        if (index === -1) {
            throw new Error("No se encontró la disponibilidad a editar");
        }

        const disponibilidadExistente = this.disponibilidades[index];
        const disponibilidadEditada = new DisponibilidadHoraria({
            id: disponibilidadExistente.id,
            diaSemana: cambios.diaSemana ?? disponibilidadExistente.diaSemana,
            horaDesde: cambios.horaDesde ?? disponibilidadExistente.horaDesde,
            horaHasta: cambios.horaHasta ?? disponibilidadExistente.horaHasta,
            sede: cambios.sede ?? disponibilidadExistente.sede,
            servicioMedico: cambios.servicioMedico ?? disponibilidadExistente.servicioMedico
        });

        const disponibilidadValidada = this.validarDisponibilidad(disponibilidadEditada);
        this.disponibilidades[index] = disponibilidadValidada;
    }

    prestaServicio(servicio) {
        return this.especialidades.some(especialidad => especialidad.esMismoServicioQue(servicio))
            || this.practicas.some(practica => practica.esMismoServicioQue(servicio));
    }

    tieneTurnoEn(fechaHora) {
        return this.turnos.some(turno => turno.fechaHora.getTime() === fechaHora.getTime());
    }

    generarTurnos(diasACubrir = 7) {
        const servicios = [...this.especialidades, ...this.practicas]; // A falta de clase abstracta "Servicio"
        servicios.forEach(s => {
            this.generarTurnosPara(s, diasACubrir);
        })
    }

    generarTurnosPara(servicio, diasACubrir = 7) {
        if (!this.prestaServicio(servicio)) {
            throw new ServicioNoPrestadoError(`El médico "${this.nombre}" no presta el servicio "${servicio.nombre}"`);
        }
        const fechaInicio = new Date();
        const fechaFinal = new Date(fechaInicio);
        fechaFinal.setDate(fechaFinal.getDate() + diasACubrir);
        const duracionTurnoEnMins = servicio.obtenerDuracionTurnoEnMins();

        const siguienteFechaParaDia = (fechaBase, diaSemana) => {
            const fecha = new Date(fechaBase);
            const diff = (diaSemana - fecha.getUTCDay() + 7) % 7;
            fecha.setUTCDate(fecha.getUTCDate() + diff);
            fecha.setUTCHours(0, 0, 0, 0);
            return fecha;
        };

        const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;
        this.disponibilidades.forEach(disponibilidad => {
            // Acá debería ser un id no el código
            if ( disponibilidad.servicioMedico.codigo !== servicio.codigo ) {
                return;
            }
            for (let fechaActual = siguienteFechaParaDia(fechaInicio, disponibilidad.diaSemana);
                fechaActual <= fechaFinal;
                fechaActual = new Date(fechaActual.getTime() + SEMANA_MS)) {
                    // me fijo todos los lunes hasta llegar al limite

                const instantes = disponibilidad.generarInstantesTurnoParaFecha(fechaActual, duracionTurnoEnMins);
                for (const fechaHoraTurno of instantes) {
                    if (this.tieneTurnoEn(fechaHoraTurno)) {
                        continue;
                    }
                    const turno = new Turno(this, fechaHoraTurno, servicio);
                    this.turnos.push(turno);
                }
            }
        })
    }

    obtenerTurnos() {
        return [...this.turnos];
    }

}