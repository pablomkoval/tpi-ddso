import { DiaSemana } from "../../../enum/DiaSemana.js";
import { HorarioInvalidoError } from "../../../errors/HorarioInvalidoError.js";
import { RangoHorarioInvalidoError } from "../../../errors/RangoHorarioInvalidoError.js";
import { DiaSemanaInvalidoError } from "../../../errors/DiaSemanaInvalidoError.js";
import { v4 as uuidv4 } from "uuid";

export class DisponibilidadHoraria{

    constructor({id = String(uuidv4()), diaSemana, horaDesde, horaHasta, sede, servicioMedico}){
        this.validarDiaSemana(diaSemana);
        this.validarHorario(horaDesde);
        this.validarHorario(horaHasta);
        this.validarRangoHorario(horaDesde, horaHasta);

        this.id = id;
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde; //string de tipo "18:40"
        this.horaHasta = horaHasta;
        this.sede = sede;
        this.servicioMedico = servicioMedico; // servicio que presta en ese horario
    }

    validarDiaSemana(diaSemana) {
        const diasValidos = Object.values(DiaSemana);
        if (!diasValidos.includes(diaSemana)) {
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
    
    obtenerHoraDesde(){
        return this.obtenerHoraMin(this.horaDesde)
    }

    obtenerHoraHasta(){
        return this.obtenerHoraMin(this.horaHasta)
    }

    obtenerHoraMin(horarioString){
        const [hora, minutos] = horarioString.split(':').map(Number)
        return minutos + hora * 60
    }
 

    cantidadTurnosPosiblesSegun(duracionServicioMins){
        const cantidadTurnosPosibles = (this.obtenerHoraHasta() - this.obtenerHoraDesde()) / duracionServicioMins
        return Math.floor(cantidadTurnosPosibles);
    }

    generarInstantesTurnoParaFecha(fecha, duracionServicioMins){
        const cantidadTurnos = this.cantidadTurnosPosiblesSegun(duracionServicioMins);
        const instantes = [];

        for (let i = 0; i < cantidadTurnos; i++) {
            const inicioTurno = this.obtenerHoraDesde() + (i * duracionServicioMins);
            const horas = Math.floor(inicioTurno / 60);
            const minutos = inicioTurno % 60;
            const fechaHora = new Date(fecha);
            fechaHora.setUTCHours(horas, minutos, 0, 0);
            instantes.push(fechaHora);
        }

        return instantes;
    }

    seSolapaCon(otraDisponibilidad) {
        if (this.diaSemana !== otraDisponibilidad.diaSemana) {
            return false; // No se solapan si son en días diferentes
        }
        if(this.id === otraDisponibilidad.id){
            return false; // No se solapan si son la misma disponibilidad (útil para edición)
        }

        const thisDesde = this.obtenerHoraDesde();
        const thisHasta = this.obtenerHoraHasta();
        const otraDesde = otraDisponibilidad.obtenerHoraDesde();
        const otraHasta = otraDisponibilidad.obtenerHoraHasta();

        return (thisDesde < otraHasta) && (thisHasta > otraDesde);
    }

}