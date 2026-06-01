import MedicoService from "../services/medico.service.js";
import { parsearId } from "../utils/parsearId.js";
import { BadRequestError } from "../shared/errors/AppError.js";
import { createServicioMedSchema } from "../validators/servicioMed.schema.zod.js";
import { createMedicoSchema } from "../validators/medico.schema.zod.js";

export default class MedicoController {
    constructor({ medicoService = new MedicoService() } = {}) {
        this.medicoService = medicoService;
    }

    toDTO(medico) {
        return {
            id: medico.id || medico._id,
            usuario: medico.usuario,
            matricula: medico.matricula,
            nombre: medico.nombre,
            especialidades: medico.especialidades,
            practicas: medico.practicas,
            sedes: medico.sedes,
            disponibilidades: medico.disponibilidades,
            turnos: medico.turnos
        };
    }

    async create(req, res, next) {
        try {
            const datosMedico = this.extraerYValidarBodyMedico(req.body)
            const medico = await this.medicoService.create(datosMedico);
            res.status(201).json(this.toDTO(medico));
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const dataMedico = this.extraerYValidarBodyMedico(req.body)
            const medicoActualizado = await this.medicoService.update(idMedico, dataMedico);
            res.status(200).json(this.toDTO(medicoActualizado));
        } catch (error) {
            return next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const medicos = await this.medicoService.findAll();
            const medicosDTO = medicos.map(medico => this.toDTO(medico));
            res.status(200).json(medicosDTO);
        } catch (error) {
            return next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const medico = await this.medicoService.findById(idMedico);
            res.status(200).json(this.toDTO(medico));
        } catch (error) {
            return next(error);
        }
    }

    async obtenerDisponibilidades(req, res, next) {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const disponibilidades = await this.medicoService.obtenerDisponibilidades(idMedico);
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
            res.status(200).json(this.toDTO(medicoActualizado));
        } catch (error) {
            return next(error);
        }
    }


    async editarDisponibilidad(req, res, next) {
        try {
            const { idMedico, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.editarDisponibilidad(idMedico, disponibilidadId, req.body);
            res.status(200).json(this.toDTO(medicoActualizado));
        } catch (error) {
            next(error);
        }
    }

    async eliminarDisponibilidad(req, res, next) {
        try {
            const { idMedico, disponibilidadId } = req.params;
            const medicoActualizado = await this.medicoService.eliminarDisponibilidad(idMedico, disponibilidadId);
            res.status(200).json(this.toDTO(medicoActualizado));
        } catch (error) {
            next(error);
        }
    }

    // Servicio Por Medico ///////////////////////////////////////////////////////////////////

    servicioMedToDTO(servicioMed) {
        const servMedDto = {
            id: servicioMed._id,
            nombre: servicioMed.servicioUnico.nombre,
            duracionTurnoEnMins: servicioMed.duracionTurnoEnMins,
            costo: servicioMed.costo,
            tipoServicio: servicioMed.tipoServicio,
            codigo: servicioMed.tipoServicio === "practica" ? servicioMed.codigo : undefined,
        }
        return servMedDto
    }


    obtenerServicioMeds = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const servicioMeds = await this.medicoService.obtenerServicioMeds(idMedico)
            res.json(servicioMeds.map(s => this.servicioMedToDTO(s)))
        } catch (error) {
            return next(error)
        }

    }

    obtenerServicioMedPorId = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idServicioMed = parsearId(req.params.idServicioMed)
            const servicioMed = await this.medicoService.obtenerServicioMedPorId(idMedico, idServicioMed)
            res.status(201).json({ status: "success", data: this.servicioMedToDTO(servicioMed) })
        } catch (error) {
            return next(error)
        }
    }


    altaServicioMed = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const servicioMed = this.extraerYValidarBodyServicioMed(req.body)

            const servicioMedCreado = await this.medicoService.altaServicioMed(idMedico, servicioMed);

            return res.status(201).json({ status: "success", data: this.servicioMedToDTO(servicioMedCreado) })
        } catch (error) {
            return next(error)
        }

    }

    bajaServicioMed = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idServicioMed = parsearId(req.params.idServicioMed)

            const servicioMedEliminado = await this.medicoService.bajaServicioMed(idMedico, idServicioMed);
            return res.status(201).json({ status: "success", data: this.servicioMedToDTO(servicioMedEliminado) })
        } catch (error) {
            return next(error)
        }
    }

    editarServicioMed = async (req, res, next) => {
        try {
            const idMedico = parsearId(req.params.idMedico)
            const idServicioMed = parsearId(req.params.idServicioMed)
            const datosServicioMed = this.extraerYValidarBodyServicioMed(req.body)
            const servicioMedActualizado = await this.medicoService.actualizarServicioMed(idMedico, idServicioMed, datosServicioMed);
            return res.status(200).json({ status: "success", data: this.servicioMedToDTO(servicioMedActualizado) })
        } catch (error) {
            return next(error)
        }

    }

    extraerYValidarBodyServicioMed(body) {
        const resultado = createServicioMedSchema.safeParse(body)
        if (!resultado.success) {
            throw new BadRequestError(
                resultado.error.issues.map(i => i.message).join(", ")
            )
        }
        return resultado.data
    }

    extraerYValidarBodyMedico(body) {
        const resultado = createMedicoSchema.safeParse(body)
        if (!resultado.success) {
            throw new BadRequestError(
                resultado.error.issues.map(i => i.message).join(", ")
            )
        }
        return resultado.data
    }

}
