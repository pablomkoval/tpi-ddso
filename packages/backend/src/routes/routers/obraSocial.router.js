import express from "express";

export class ObraSocialRouter {
    constructor(controller) {
        this.controller = controller;
        this.obraSocialRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        /**
         * @swagger
         * /notificaciones:
         *   get:
         *     summary: Obtiene la lista de todas las obras sociales con sus planes asociados
         *     tags: [ObrasSociales]
         *     responses:
         *       200:
         *         description: Lista de obras sociales obtenida correctamente
         *       500:
         *         description: Error interno del servidor
         */
        this.obraSocialRouter.get("/", (req, res, next) => {
            this.controller.obtenerTodas(req, res, next);
        });
    }

    getRouter() {
        return this.obraSocialRouter;
    }
}