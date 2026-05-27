import MedicoService from "../../services/MedicoService.js";
import { parsearId } from "../../utils/parsearId.js";

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
            const medico = await this.medicoService.update(req.params.idMedico, req.body);
            res.json(medico);
        } catch (error) {
            return next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const medicos = await this.medicoService.findAll();
            res.json(medicos);
        } catch (error) {
            return next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const id = parsearId(req.params.idMedico)
            const medico = await this.medicoService.findById(id);
            res.json(medico);
        } catch (error) {
            return next(error);
        }
    }
    async obtenerDisponibilidades(req, res, next) {
        try {
            const id = parsearId(req.params.idMedico)
            const disponibilidades = await this.medicoService.obtenerDisponibilidades(id);
            res.json(disponibilidades);
        }
        catch (error) {
            return next(error);
        }
    }

    async agregarDisponibilidades(req, res, next) {
        const nuevasDisponibilidades = req.body.disponibilidades;

        try {
            const id = parsearId(req.params.idMedico)
            const medicoActualizado = await this.medicoService.agregarDisponibilidades(id, nuevasDisponibilidades);
            res.json(medicoActualizado);
        } catch (error) {
            return next(error);
        }
    }

    /* altaServicioMed = async (req, res, next) => {
        try {
            const id = parsearId(req.params.idMedico)
            const medicoActualizado = await this.medicoService.altaServicioMed(id, servicio);
            res.json(medicoActualizado);
        } catch (error) {
            return next(error)
        }

    }

    bajaServicioMed = async (req, res, next) => {
        try {
            const id = parsearId(req.params.idMedico)
            const medicoActualizado = await this.medicoService.bajaServicioMed(id, servicio);
            res.json(medicoActualizado);
        } catch (error) {
            return next(error)
        }
    } */


}