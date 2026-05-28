
import { parsearId } from "../../utils/parsearId.js";
import { BadRequestError } from "../../shared/errors/AppError.js";
import { servicioMedSchema } from "../../validators/Paciente.schema.js"; 
import MedicoService from "../../services/PacienteService.js";


export default class PacienteController {
    constructor({ PacienteService = new PacienteService() } = {}) {
        this.PacienteService = PacienteService;
    }

    async create(req, res, next) {
        try {
            const paciente = await this.PacienteService.create(req.body);
            res.status(201).json(paciente);
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const pacienteActualizado = await this.PacienteService.update(req.params.idPaciente, req.body);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            return next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const paciente = await this.PacienteService.findAll();
            res.status(200).json(paciente);
        } catch (error) {
            return next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const id = parsearId(req.params.idPaciente)
            const paciente = await this.PacienteService.findById(id);
            res.status(200).json(paciente);
        } catch (error) {
            return next(error);
        }
    }


}
