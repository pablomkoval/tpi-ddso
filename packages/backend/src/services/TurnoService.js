
export default class TurnoService {
    constructor({ turnoRepository } = {}, { medicoRepository } = {}) {
        this.turnoRepository = turnoRepository;
        this.medicoRepository = medicoRepository;
    }

    async generarTurnos() {
        
    }
}