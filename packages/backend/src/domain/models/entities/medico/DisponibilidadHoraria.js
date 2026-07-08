import { DateTime } from "luxon";
import { DiaSemana } from "../../../enum/DiaSemana.js";
import { HorarioInvalidoError } from "../../../errors/HorarioInvalidoError.js";
import { RangoHorarioInvalidoError } from "../../../errors/RangoHorarioInvalidoError.js";
import { DiaSemanaInvalidoError } from "../../../errors/DiaSemanaInvalidoError.js";
import { ZONA_HORARIA_ARGENTINA } from "../../../../shared/timezone.js";
import { uuidv4 } from "zod";

export class DisponibilidadHoraria {

    constructor({ id = String(uuidv4()), diaSemana, horaDesde, horaHasta, sede, prestacion }) {
        this.validarDiaSemana(diaSemana);
        this.validarHorario(horaDesde);
        this.validarHorario(horaHasta);
        this.validarRangoHorario(horaDesde, horaHasta);

        this.id = id;
        this.diaSemana = Number(diaSemana);  // ← Convierte a número aquí
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
        this.sede = sede;
        this.prestacion = prestacion;
    }

    validarDiaSemana(diaSemana) {
        const diasValidos = Object.values(DiaSemana);
        const diaSemanaNum = Number(diaSemana);

        if (isNaN(diaSemanaNum) || !diasValidos.includes(diaSemanaNum)) {
            throw new DiaSemanaInvalidoError(`El día de semana "${diaSemana}" no es válido`);
        }
    }

    validarHorario(horarioString) {
        const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
        if (!regex.test(horarioString)) {
            throw new HorarioInvalidoError(`El horario "${horarioString}" no tiene un formato válido (esperado HH:MM)`);
        }
    }

    validarRangoHorario(horaDesde, horaHasta) {
        const desdeMin = this.obtenerHoraMin(horaDesde);
        const hastaMin = this.obtenerHoraMin(horaHasta);
        if (desdeMin >= hastaMin) {
            throw new RangoHorarioInvalidoError(`La hora de inicio (${horaDesde}) debe ser anterior a la hora de fin (${horaHasta})`);
        }
    }

    obtenerHoraDesde() {
        return this.obtenerHoraMin(this.horaDesde)
    }

    obtenerHoraHasta() {
        return this.obtenerHoraMin(this.horaHasta)
    }

    obtenerHoraMin(horarioString) {
        const [hora, minutos] = horarioString.split(':').map(Number)
        return minutos + hora * 60
    }


    cantidadTurnosPosiblesSegun(duracionServicioMins) {
        const cantidadTurnosPosibles = (this.obtenerHoraHasta() - this.obtenerHoraDesde()) / duracionServicioMins
        return Math.floor(cantidadTurnosPosibles);
    }

    generarInstantesTurnoParaFecha(fecha, duracionServicioMins) {
        const cantidadTurnos = this.cantidadTurnosPosiblesSegun(duracionServicioMins);
        const instantes = [];
        for (let i = 0; i < cantidadTurnos; i++) {
            const inicioTurno = this.obtenerHoraDesde() + (i * duracionServicioMins);
            const horas = Math.floor(inicioTurno / 60);
            const minutos = inicioTurno % 60;

            // horaDesde/horaHasta representan hora local de Argentina, no UTC.
            // Se arma el instante en esa zona para que Luxon calcule el offset correcto
            // (y quede como UTC real al pasarlo a Date, que es como Mongo lo persiste).
            const fechaHora = DateTime.fromObject(
                {
                    year: fecha.getUTCFullYear(),
                    month: fecha.getUTCMonth() + 1,
                    day: fecha.getUTCDate(),
                    hour: horas,
                    minute: minutos,
                },
                { zone: ZONA_HORARIA_ARGENTINA },
            ).toJSDate();

            instantes.push(fechaHora);
        }

        return instantes;
    }

    seSolapaCon(otraDisponibilidad) {
        if (this.diaSemana !== otraDisponibilidad.diaSemana) {
            return false; // No se solapan si son en días diferentes
        }
        const thisId = this._id || this.id;
        const otraId = otraDisponibilidad._id || otraDisponibilidad.id;
        if (thisId && otraId && String(thisId) === String(otraId)) {
            return false; // No se solapan si son la misma disponibilidad (útil para edición)
        }

        const thisDesde = this.obtenerHoraDesde();
        const thisHasta = this.obtenerHoraHasta();
        const otraDesde = otraDisponibilidad.obtenerHoraDesde();
        const otraHasta = otraDisponibilidad.obtenerHoraHasta();

        return (thisDesde < otraHasta) && (thisHasta > otraDesde);
    }

}