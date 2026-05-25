import express from "express";
import { NotificacionesController } from "../../../controllers/notificaciones.controller.js";

    const notificacionesRouter = express.Router();

    // router.get("/leidas", (req, res) => {
    //     controller.
    // });
    notificacionesRouter.get("/", (req, res, next) => {
        NotificacionesController.findAll(req, res, next);
    })


export default notificacionesRouter;
