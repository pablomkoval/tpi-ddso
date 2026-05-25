import MedicoRepository from "../../repositories/MedicoRepository.js";

export default class MedicoService {
    constructor({ medicoRepository = new MedicoRepository() } = {}) {
        this.medicoRepository = medicoRepository;
    }

}