import express from "express";


export class ServicioRouter {
    constructor(controller) {
        this.controller = controller;
        this.servicioRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        this.servicioRouter.get("/", (req, res, next) => { this.controller.findAll(req, res, next); });
        this.servicioRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });

        this.servicioRouter.get("/:id", (req, res, next) => { this.controller.findById(req, res, next); });
        this.servicioRouter.put("/:id", (req, res, next) => { this.controller.update(req, res, next); });
        this.servicioRouter.delete("/:id", (req, res, next) => { this.controller.delete(req, res, next); });

    }

    getRouter() {
        return this.servicioRouter;
    }
}

/* import { ServiciosController } from "../../controllers/servicios.controller.js";

const servicioController = new ServiciosController

const serviciosRouter = express.Router();

serviciosRouter.route('/')
    .get((req, res, next) => servicioController.findAll(req, res, next))
    .post((req, res, next) => servicioController.create(req, res, next))


serviciosRouter.route('/:id')
    .get((req, res, next) => servicioController.findById(req, res, next))
    .put((req, res, next) => servicioController.update(req, res, next))
    .delete((req, res, next) => servicioController.delete(req, res, next))


export default serviciosRouter; */