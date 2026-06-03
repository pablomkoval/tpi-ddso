import { parsearId } from "../utils/parsearId.js";

export class PacienteController {
    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }

    async create(req, res, next) {
        try {
            const paciente = await this.pacienteService.create(req.body);
            res.status(201).json(paciente);
        } catch (error) {
            return next(error);
        }
    }

    async update(req, res, next) {
        try {
            const idPaciente = parsearId(req.params.idPaciente)
            const pacienteActualizado = await this.pacienteService.update(idPaciente, req.body);
            res.status(200).json(pacienteActualizado);
        } catch (error) {
            return next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const pacientes = await this.pacienteService.findAll();
            res.status(200).json(pacientes);
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

    async consultarHistorial(req, res, next) {
        try {
            const idPaciente = parsearId(req.params.idPaciente);
            const historial = await this.pacienteService.consultarHistorial(idPaciente);
            res.status(200).json(historial);
        } catch (error) {
            return next(error);
        }
    }

    async reservarTurno(req, res, next) {
        try {
            const idPaciente = parsearId(req.params.idPaciente);
            const turnoId = parsearId(req.params.turnoId);
            const turnoReservado = await this.pacienteService.reservarTurno(idPaciente, turnoId);
            res.status(200).json(turnoReservado);
        } catch (error) {
            return next(error);
        }
    }

    async cancelarTurno(req, res, next) {
        try {
            const idPaciente = parsearId(req.params.idPaciente);
            const turnoId = parsearId(req.params.turnoId);
            const { motivo } = req.body;
            const turnoCancelado = await this.pacienteService.cancelarTurno(idPaciente, turnoId, motivo);
            res.status(200).json(turnoCancelado);
        } catch (error) {
            return next(error);
        }
    }

    async solicitarCambioFecha(req, res, next) {
        try {
            const idPaciente = parsearId(req.params.idPaciente);
            const turnoActualId = parsearId(req.params.turnoId);
            const { nuevoTurnoId } = req.body;
            const result = await this.pacienteService.solicitarCambioFecha(idPaciente, turnoActualId, nuevoTurnoId);
            res.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    }
}
