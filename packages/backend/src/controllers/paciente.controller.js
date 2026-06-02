
import { parsearId } from "../utils/parsearId.js";
//import { BadRequestError } from "../shared/errors/AppError.js";
//import { createServicioMedSchema } from "../../validators/Paciente.schema.js";
//import MedicoService from "../../services/PacienteService.js"; // en teoria y si es necesario, el paciente service se comunica con el medico service, no el paciente controller


export class PacienteController {
    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }

    async create(req, res, next) {
        try {
            //schema de zod para parsear el body
            const paciente = await this.pacienteService.create(req.body);
            res.status(201).json(paciente);
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const idPaciente = parsearId(req.params.idPaciente)
            //schema de zod para parsear el body 
            const pacienteActualizado = await this.pacienteService.update(idPaciente, req.body);
            res.status(200).json(pacienteActualizado);
        } catch (error) {
            return next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const paciente = await this.pacienteService.findAll();
            res.status(200).json(paciente);
        } catch (error) {
            return next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const id = parsearId(req.params.idPaciente)
            const paciente = await this.pacienteService.findById(id);
            res.status(200).json(paciente);
        } catch (error) {
            return next(error);
        }
    }


}
