import express from "express";

export class SedeRouter {
    constructor(controller) {
        this.controller = controller;
        this.sedeRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        /**
         * @swagger
         * /sedes:
         *  post:
         *      summary: Crear una nueva sede de atención
         *      tags: [Sedes]
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *          schema:
         *              type: object
         *              properties:
         *                  nombre:
         *                      type: string
         *                      example: 'Sweet Medical Medrano'
         *                  direccion:
         *                      type: string
         *                      example: 'Medrano 951, CABA'
         *      responses:
         *          201:
         *              description: Sede creada exitosamente
         *  get:
         *      summary: Obtener todas las sedes médicas registradas
         *      tags: [Sedes]
         *      responses:
         *          200:
         *              description: Lista de sedes obtenida correctamente
         */
        this.sedeRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });
        this.sedeRouter.get("/", (req, res, next) => { this.controller.findAll(req, res, next); });

        /* this.sedeRouter.get("/:idSede", (req, res, next) => { this.controller.findById(req, res, next); });
        this.sedeRouter.put("/:idSede", (req, res, next) => { this.controller.update(req, res, next); });
 */
    }

    getRouter() {
        return this.sedeRouter;
    }
}
