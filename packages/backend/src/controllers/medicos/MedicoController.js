import MedicoService from "../../services/MedicoService.js";
import { parsearId } from "../../utils/parsearId.js";
import { BadRequestError } from "../../shared/errors/AppError.js";
import { servicioMedSchema } from "../../validators/servicioMed.schema.js";

export default class MedicoController {
    constructor({ medicoService = new MedicoService() } = {}) {
        this.medicoService = medicoService;
    }

    async create(req, res, next) {
        try {
            const medico = await this.medicoService.create(req.body);
            res.status(201).json(medico);
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const medicoActualizado = await this.medicoService.update(req.params.idMedico, req.body);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            return next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const medicos = await this.medicoService.findAll();
            res.status(200).json(medicos);
        } catch (error) {
            return next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const id = parsearId(req.params.idMedico)
            const medico = await this.medicoService.findById(id);
            res.status(200).json(medico);
        } catch (error) {
            return next(error);
        }
    }

    async obtenerDisponibilidades(req, res, next) {
        try {
            const id = parsearId(req.params.idMedico)
            const disponibilidades = await this.medicoService.obtenerDisponibilidades(id);
            res.status(200).json(disponibilidades);
        }
        catch (error) {
            return next(error);
        }
    }


    async agregarDisponibilidades(req, res, next) {
        const nuevasDisponibilidades = req.body.disponibilidades;

        try {
            const idMedico = parsearId(req.params.idMedico)
            const medicoActualizado = await this.medicoService.agregarDisponibilidades(idMedico, nuevasDisponibilidades);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            return next(error);
        }
    }


    async editarDisponibilidad(req, res, next) {
        try {
            const { idMedico, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.editarDisponibilidad(idMedico, disponibilidadId, req.body);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            next(error);
        }
    }

    async eliminarDisponibilidad(req, res, next) {
        try {
            const { idMedico, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.eliminarDisponibilidad(idMedico, disponibilidadId);
            res.status(200).json(medicoActualizado);
        } catch (error) {
            next(error);
        }
    }


    obternerServicioMeds = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const servicioMeds = await this.medicoService.obtenerServicioMeds(idMedico)
            res.json(servicioMeds)
        } catch (error) {
            return next(error)
        }

    }

    obternerServicioMedsPorId = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idServicioMed = parsearId(req.param.idServicioMed)
            const servicioMed = await this.medicoService.obtenerServicioMedPorId(idMedico, idServicioMed)
            res.json(servicioMed)
        } catch (error) {
            return next(error)
        }
    }


    altaServicioMed = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const servicioMed = this.extraerYValidarBodyServicioMed(req.body)

            const servicioMedCreado = await this.medicoService.altaServicioMed(idMedico, servicioMed);
            
            console.error("sobrevivi medicoService")
           
            return res.status(201).json({ status: "success", data: servicioMedCreado })
        } catch (error) {
            return next(error)
        }

    }

    bajaServicioMed = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idServicioMed = parsearId(req.param.idServicioMed)

            const servicioMedEliminado = await this.medicoService.bajaServicioMed(idMedico, idServicioMed);
            return res.status(201).json({ status: "success", data: servicioMedEliminado })
        } catch (error) {
            return next(error)
        }
    }

    editarServicioMed = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idServicioMed = parsearId(req.param.idServicioMed)
            const datosServicioMed = this.extraerYValidarBodyServicioMed(req.body)
            const servicioMedActualizado = await this.medicoService.actualizarServicioMed(idMedico, idServicioMed, datosServicioMed);

            return res.status(200).json({ status: "success", data: servicioMedActualizado })
        } catch (error) {
            return next(error)
        }

    }

    extraerYValidarBodyServicioMed(body) {
        const resultado = servicioMedSchema.safeParse(body)
        if (!resultado.success) {
            throw new BadRequestError(
                resultado.error.issues.map(i => i.message).join(", ")
            )
        }
        console.error("sobrevivi zod")
        return resultado.data
    }

}
