import express from "express";


export class NotificacionesRouter {
    constructor(controller) {
        this.controller = controller;
        this.notificacionesRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        /**
         * @swagger
         * /notificaciones:
         *   get:
         *     summary: Obtiene todas las notificaciones paginadas
         *     tags: [Notificaciones]
         *     responses:
         *       200:
         *         description: Lista de notificaciones
         * 
         *   post:
         *     summary: Crea una nueva notificación
         *     tags: [Notificaciones]
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
        this.notificacionesRouter.get("/", (req, res, next) => { this.controller.findAllPaginated(req, res, next); });
        this.notificacionesRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });

        /**
         * @swagger
         * /notificaciones/leidas:
         *   get:
         *     summary: Obtiene notificaciones leídas
         *     tags: [Notificaciones]
         *     responses:
         *       200:
         *         description: Lista de notificaciones leídas
         */
        this.notificacionesRouter.get("/leidas", (req, res, next) => {
            this.controller.obtenerLeidas(req, res, next);
        });

        /**
         * @swagger
         * /notificaciones/no-leidas:
         *   get:
         *     summary: Obtiene notificaciones no leídas
         *     tags: [Notificaciones]
         *     parameters:
         *       - in: query
         *         name: userId
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Lista de notificaciones no leídas
         */
        this.notificacionesRouter.get("/no-leidas", (req, res, next) => {
            this.controller.obtenerNoLeidas(req, res, next);
        });

        /**
         * @swagger
         * /notificaciones/{id}/lecturas:
         *   post:
         *     summary: Marca una notificación como leída
         *     tags: [Notificaciones]
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
        this.notificacionesRouter.post("/:id/lecturas", (req, res, next) => {
            this.controller.marcarComoLeida(req, res, next);
        });

        /**
         * @swagger
         * /notificaciones/{id}:
         *   delete:
         *     summary: Realiza un borrado lógico de una notificación
         *     tags: [Notificaciones]
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
        this.notificacionesRouter.delete("/:id", (req, res, next) => {
            this.controller.softDelete(req, res, next);
        });
    }

    getRouter() {
        return this.notificacionesRouter;
    }
}