import MedicoService from "../../services/MedicoService.js";

export default class MedicoController {
    constructor({ medicoService = new MedicoService() } = {}) {
        this.medicoService = medicoService;
    }

    async obtenerDisponibilidades(req,res,next) {
        const id = req.params.id;
            try {
                const disponibilidades = await this.medicoService.obtenerDisponibilidades(id);
                res.json(disponibilidades);
            }
            catch (error) {
                next(error);
            }
    }
}