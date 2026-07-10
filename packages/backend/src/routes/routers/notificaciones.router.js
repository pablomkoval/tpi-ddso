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
         *     summary: Obtiene notificaciones paginadas del usuario autenticado
         *     tags: [Notificaciones]
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *       - in: query
         *         name: leida
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Lista paginada de notificaciones
         *
         *   post:
         *     summary: Crea una notificación
         *     tags: [Notificaciones]
         *     responses:
         *       201:
         *         description: Notificación creada
         */
        this.notificacionesRouter.get("/", (req, res, next) => { this.controller.findAllPaginated(req, res, next); });
        this.notificacionesRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });

        /**
         * @swagger
         * /notificaciones/count:
         *   get:
         *     summary: Obtiene cantidad de notificaciones
         *     tags: [Notificaciones]
         *     parameters:
         *       - in: query
         *         name: leida
         *         schema:
         *           type: boolean
         *     responses:
         *       200:
         *         description: Cantidad de notificaciones
         */
        this.notificacionesRouter.get("/count", (req, res, next) => {this.controller.count(req, res, next);});

        /**
         * @swagger
         * /notificaciones/resumen:
         *   get:
         *     summary: Obtiene resumen de notificaciones del usuario
         *     tags: [Notificaciones]
         *     responses:
         *       200:
         *         description: Resumen de notificaciones
         */
        this.notificacionesRouter.get("/resumen", (req, res, next) => {this.controller.resumen(req, res, next);});

        /**
         * @swagger
         * /notificaciones/lecturas:
         *   post:
         *     summary: Marca todas las notificaciones del usuario como leídas
         *     tags: [Notificaciones]
         *     responses:
         *       200:
         *         description: Notificaciones actualizadas
         */
        this.notificacionesRouter.post("/lecturas", (req, res, next) => {this.controller.marcarTodasComoLeidas(req, res, next);});

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