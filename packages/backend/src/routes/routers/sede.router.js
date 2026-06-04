import express from "express";

export class SedeRouter {
    constructor(controller) {
        this.controller = controller;
        this.sedeRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {
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
