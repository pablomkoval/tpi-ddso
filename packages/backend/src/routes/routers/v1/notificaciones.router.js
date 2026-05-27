import express from "express";
import { NotificacionesController } from "../../../controllers/notificaciones.controller.js";
import { NotificacionesService } from "../../../services/notificaciones.service.js";
import { NotificacionesRepository } from "../../../domain/models/repositories/notificaciones.repository.js";

const notificacionesRouter = express.Router();
const repository = new NotificacionesRepository();
const service = new NotificacionesService(repository);
const controller = new NotificacionesController(service);

/**
 * @swagger
 * /v1/notificaciones:
 *   get:
 *     summary: Obtiene todas las notificaciones paginadas
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 * 
 *   post:
 *     summary: Crea una nueva notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinatario:
 *                 type: string
 *               remitente:
 *                 type: string
 *               mensaje:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notificación creada
 */
notificacionesRouter.get("/", (req, res, next) => { controller.findAllPaginated(req, res, next); });
notificacionesRouter.post("/", (req, res, next) => { controller.create(req, res, next); });

/**
 * @swagger
 * /v1/notificaciones/leidas:
 *   get:
 *     summary: Obtiene notificaciones leídas
 *     responses:
 *       200:
 *         description: Lista de notificaciones leídas
 */
notificacionesRouter.get("/leidas", (req, res, next) => {
    controller.obtenerLeidas(req, res, next);
});

/**
 * @swagger
 * /v1/notificaciones/no-leidas:
 *   get:
 *     summary: Obtiene notificaciones no leídas
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de notificaciones no leídas
 */
notificacionesRouter.get("/no-leidas", (req, res, next) => {
    controller.obtenerNoLeidas(req, res, next);
});

/**
 * @swagger
 * /v1/notificaciones/{id}/leer:
 *   patch:
 *     summary: Marca una notificación como leída
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 */
notificacionesRouter.patch("/:id/leer", (req, res, next) => {
    controller.marcarComoLeida(req, res, next);
});

/**
 * @swagger
 * /v1/notificaciones/{id}:
 *   delete:
 *     summary: Realiza un borrado lógico de una notificación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Notificación eliminada
 */
notificacionesRouter.delete("/:id", (req, res, next) => {
    controller.softDelete(req, res, next);
});

export default notificacionesRouter;