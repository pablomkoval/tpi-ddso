import express from "express";
import TurnoController from "../../../controllers/turnos/TurnoController.js";

const router = express.Router();
const turnoController = new TurnoController();

router.route('/:id/reservar')
    .post((req, res, next) => turnoController.reservar(req, res, next));

router.route('/:id/cancelar')
    .post((req, res, next) => turnoController.cancelar(req, res, next));

export default router;