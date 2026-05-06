export class DisponibilidadHoraria{

    constructor(diaSemana, horaDesde, horaHasta){
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde; //string de tipo "18:40"
        this.horaHasta = horaHasta;
    }
    
    getDiaSemana(){ //getters no tan necesarios,tan clean pero borrar para ser consistente?
        return this.diaSemana
    }
    obtenerHoraDesde(){
        self.obtenerHoraMin(this.horaDesde)
    }

    obtenerHoraHasta(){
        self.obtenerHoraMin(this.horaHasta)
    }

    obtenerHoraMin(horarioString){
        const [hora, minutos] = this.horarioString.split(':').map(Number)
        return minutos + hora * 60
    }
 

    cantidadTurnosPosiblesSegun(duracionServicioMins){
        const cantidadTurnosPosibles = (this.obtenerHoraHasta - this.obtenerHoraDesde)  / duracionServicioMins
        return Math.floor(cantidadTurnosPosibles);
    }

}