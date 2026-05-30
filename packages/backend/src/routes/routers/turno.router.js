import express from "express";
import TurnoController from "../../controllers/turnos/TurnoController.js";

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

export default turnoRouter;