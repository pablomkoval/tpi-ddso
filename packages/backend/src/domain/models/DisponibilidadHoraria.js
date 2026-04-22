export class DisponibilidadHoraria{

    constructor(diaSemana, horaDesde, horaHasta){
        this.diaSemana = diaSemana;
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
    }
    
    getDiaSemana(){
        return this.diaSemana
    }
    getHoraDesde(){
        return this.horaDesde
    }
    getHoraHasta(){
        return this.horaHasta
    }
 
    cantidadTurnosPosiblesSegun(duracionServicioMins){
        const cantidadTurnosPosibles = 60 * (this.horaHasta - this.horaDesde) / duracionServicioMins
        return Math.floor(cantidadTurnosPosibles);
    }

}