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

        this.obraSocialRouter.post("/", (req, res, next) => {
            this.controller.create(req, res, next);
        })

        this.obraSocialRouter.delete("/", (req, res, next) => {
            this.controller.delete(req, res, next);
        })

        this.obraSocialRouter.get("/:id", (req, res, next) => {
            this.controller.findById(req, res, next);
        })

        this.obraSocialRouter.patch("/:id", (req, res, next) => {
            this.controller.update(req, res, next);
        })



        this.obraSocialRouter.post("/:id/planes", (req, res, next) => {
            this.controller.createPlan(req, res, next);
        })

        this.obraSocialRouter.patch("/:id/planes/:idPlan", (req, res, next) => {
            this.controller.updatePlan(req, res, next);
        })

        this.obraSocialRouter.delete("/:id/planes/:idPlan", (req, res, next) => {
            this.controller.deletePlan(req, res, next);
        })

    }

    getRouter() {
        return this.obraSocialRouter;
    }
}