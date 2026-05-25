import MedicoService from "../../services/MedicoService.js";

export default class MedicoController {
    constructor({ medicoService = new MedicoService() } = {}) {
        this.medicoService = medicoService;
    }

}