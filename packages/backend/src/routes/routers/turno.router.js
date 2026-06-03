import express from "express";


export class TurnoRouter {
    constructor(controller) {
        this.controller = controller;
        this.turnoRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        this.turnoRouter.get("/disponibles", (req, res, next) => { this.controller.getDisponibles(req, res, next); });

        this.turnoRouter.get("/:id", (req, res, next) => { this.controller.getById(req, res, next); });

        //cambiar las dos rutas a unas que no tengan verbos o juntar los dos en uno llamado "/:id/estados" y mandarle el estado del turno(?)
        // this.turnoRouter.put("/:id/reservar", (req, res, next) => { this.controller.reservar(req, res, next); });
        // this.turnoRouter.delete("/:id/cancelar", (req, res, next) => { this.controller.cancelar(req, res, next); });
        this.turnoRouter.post("/:id/estados", (req, res, next) => { this.controller.cambiarEstado(req, res, next); });
        // 2 implementaciones vigentes, una vuela
        this.turnoRouter.put("/:id/reservar", (req, res, next) => { this.controller.reservar(req, res, next); });
        this.turnoRouter.delete("/:id/cancelar", (req, res, next) => { this.controller.cancelar(req, res, next); });

    }

    getRouter() {
        return this.turnoRouter;
    }
}

/* import TurnoController from "../../controllers/turnos/TurnoController.js";

const turnoRouter = express.Router();
const turnoController = new TurnoController();


turnoRouter.route('/disponibles')
    .get((req, res, next) => turnoController.getDisponibles(req, res, next)); 

turnoRouter.route('/:id')
    .get((req, res, next) => turnoController.getById(req, res, next));

//cambiar las dos rutas a unas que no tengan verbos o juntar los dos en uno llamado "/:id/estados" y mandarle el estado del turno(?)
turnoRouter.route('/:id/reservar')
    .post((req, res, next) => turnoController.reservar(req, res, next));

turnoRouter.route('/:id/cancelar')
    .post((req, res, next) => turnoController.cancelar(req, res, next));

export default turnoRouter; */