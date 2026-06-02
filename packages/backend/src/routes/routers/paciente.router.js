import express from "express";


export class PacienteRouter {
    constructor(controller) {
        this.controller = controller;
        this.pacienteRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() { // Ej Estructura:

        /*  this.pacienteRouter.get("/disponibles", (req, res, next) => { this.controller.getDisponibles(req, res, next); });
 
         this.pacienteRouter.get("/:id", (req, res, next) => { this.controller.getById(req, res, next); });
 
         this.pacienteRouter.put("/:id/reservar", (req, res, next) => { this.controller.reservar(req, res, next); });
         this.pacienteRouter.delete("/:id/cancelar", (req, res, next) => { this.controller.cancelar(req, res, next); }); */

    }

    getRouter() {
        return this.pacienteRouter;
    }
}
