import express from "express";

export class PacienteRouter {
    constructor(controller) {
        this.controller = controller;
        this.pacienteRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.pacienteRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });
        this.pacienteRouter.get("/", (req, res, next) => { this.controller.findAll(req, res, next); });
        
        this.pacienteRouter.get("/:idPaciente", (req, res, next) => { this.controller.findById(req, res, next); });
        this.pacienteRouter.put("/:idPaciente", (req, res, next) => { this.controller.update(req, res, next); });

        // Rutas del ciclo de vida de los turnos del paciente
        this.pacienteRouter.get("/:idPaciente/turnos", (req, res, next) => { this.controller.consultarHistorial(req, res, next); });
        this.pacienteRouter.post("/:idPaciente/turnos/:turnoId/reservar", (req, res, next) => { this.controller.reservarTurno(req, res, next); });
        this.pacienteRouter.post("/:idPaciente/turnos/:turnoId/cancelar", (req, res, next) => { this.controller.cancelarTurno(req, res, next); });
        this.pacienteRouter.post("/:idPaciente/turnos/:turnoId/solicitar-cambio", (req, res, next) => { this.controller.solicitarCambioFecha(req, res, next); });
    }

    getRouter() {
        return this.pacienteRouter;
    }
}
