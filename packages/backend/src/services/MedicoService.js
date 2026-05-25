import MedicoRepository from "../../repositories/MedicoRepository.js";

export default class MedicoService {
    constructor({ medicoRepository = new MedicoRepository() } = {}) {
        this.medicoRepository = medicoRepository;
    }

    async obtenerDisponibilidades(id) {
        try {
            const medico = await this.medicoRepository.model.findById(id).populate('disponibilidades');
            if (!medico) {
                throw new Error('Médico no encontrado');
            }
            return medico.disponibilidades;
        } catch (error) {
            throw new Error(`Error al obtener disponibilidades: ${error.message}`, { cause: error });
        } 
    }
}