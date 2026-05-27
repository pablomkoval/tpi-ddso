import express from "express";
import { NotificacionesController } from "../../../controllers/notificaciones.controller.js";
import { NotificacionesService } from "../../../services/notificaciones.service.js";
import { NotificacionesRepository } from "../../../domain/models/repositories/notificaciones.repository.js";

const notificacionesRouter = express.Router();
const repository = new NotificacionesRepository();
const service = new NotificacionesService(repository);
const controller = new NotificacionesController(service);

notificacionesRouter.get("/", (req, res, next) => {
    controller.findAllPaginated(req, res, next);
});

notificacionesRouter.get("/leidas", (req, res, next) => {
    controller.obtenerLeidas(req, res, next);
});

notificacionesRouter.get("/no-leidas", (req, res, next) => {
    controller.obtenerNoLeidas(req, res, next);
});

notificacionesRouter.patch("/:id/leer", (req, res, next) => {
    controller.marcarComoLeida(req, res, next);
});

notificacionesRouter.post("/", (req, res, next) => {
    controller.create(req, res, next);
});

notificacionesRouter.delete("/:id", (req, res, next) => {
    controller.softDelete(req, res, next);
});

export default notificacionesRouter;
