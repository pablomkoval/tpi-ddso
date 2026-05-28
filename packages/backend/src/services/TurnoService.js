import MedicoRepository from "../domain/models/repositories/MedicoRepository.js";
import TurnoRepository from "../domain/models/repositories/TurnoRepository.js";

export default class TurnoService {
    constructor({ turnoRepository = new TurnoRepository() } = {}, { medicoRepository = new MedicoRepository() } = {}) {
        this.turnoRepository = turnoRepository;
        this.medicoRepository = medicoRepository;
    }

    async generarTurnos() {
        const medicos = await this.medicoRepository.findAll();

        medicos.forEach(medico => {
            medico.generarTurnos();
            medico.turnos.forEach(turno => this.turnoRepository.save(turno));
            this.medicoRepository.update(medico);
        })
    }

    async reservarTurno() {
   

    }

    async cancelarTurno() {
   

    }
}
