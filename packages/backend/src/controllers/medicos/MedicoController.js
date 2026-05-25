import MedicoService from "../../services/MedicoService.js";

export default class MedicoController {
    constructor({ medicoService = new MedicoService() } = {}) {
        this.medicoService = medicoService;
    }
    
    async create(req, res, next) {
        try {
            const medico = await this.medicoService.create(req.body);
            res.status(201).json(medico);
        } catch (error) {
            next (error);
        }
    }

    async update(req, res, next) {
        try {
            const medico = await this.medicoService.update(req.params.id, req.body);
            res.json(medico);
        } catch (error) {
            next(error);
        }
    }
    
    async findAll(req, res, next) {
        try {
            const medicos = await this.medicoService.findAll();
            res.json(medicos);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const medico = await this.medicoService.findById(req.params.id);
            res.json(medico);
        } catch (error) {
            next(error);
        }
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