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
            const medicoActualizado = await this.medicoService.update(req.params.id, req.body);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            next(error);
        }
    }
    
    async findAll(req, res, next) {
        try {
            const medicos = await this.medicoService.findAll();
            res.status(200).json(medicos);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const medico = await this.medicoService.findById(req.params.id);
            res.status(200).json(medico);
        } catch (error) {
            next(error);
        }
    }
    async obtenerDisponibilidades(req,res,next) {
        const id = req.params.id;
            try {
                const disponibilidades = await this.medicoService.obtenerDisponibilidades(id);
                res.status(200).json(disponibilidades);
            }
            catch (error) {
                next(error);
            }
    }

    async agregarDisponibilidades(req,res,next) {
        const id = req.params.id;
        const nuevasDisponibilidades = req.body.disponibilidades;

        try {
            const medicoActualizado = await this.medicoService.agregarDisponibilidades(id, nuevasDisponibilidades);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            next(error);
        }
    }

    async editarDisponibilidad(req, res, next) {
        try {
            const { id, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.editarDisponibilidad(id, disponibilidadId, req.body);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            next(error);
        }
    }
    
    async eliminarDisponibilidad(req, res, next) {
        try {
            const { id, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.eliminarDisponibilidad(id, disponibilidadId);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            next(error);
        }
    }
    
}