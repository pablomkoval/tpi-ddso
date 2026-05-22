import { DiaSemana } from "../../enum/DiaSemana.js";
import { HorarioInvalidoError } from "../../errors/HorarioInvalidoError.js";
import { RangoHorarioInvalidoError } from "../../errors/RangoHorarioInvalidoError.js";
import { DiaSemanaInvalidoError } from "../../errors/DiaSemanaInvalidoError.js";

export class DisponibilidadHoraria{

    constructor(diaSemana, horaDesde, horaHasta, sede){
        this.validarDiaSemana(diaSemana);
        this.validarHorario(horaDesde);
        this.validarHorario(horaHasta);
        this.validarRangoHorario(horaDesde, horaHasta);

        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde; //string de tipo "18:40"
        this.horaHasta = horaHasta;
        this.sede = sede;
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
    
    getDiaSemana(){ //getters no tan necesarios,tan clean pero borrar para ser consistente?
        return this.diaSemana
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
            const inicioMinutos = this.obtenerHoraDesde() + (i * duracionServicioMins);
            const fechaHora = new Date(fecha);
            fechaHora.setHours(0, inicioMinutos, 0, 0);
            instantes.push(fechaHora);
        }

        return instantes;
    }

}