import express from "express";
import healthcheckRouter from "./healthcheck.router.js";
import notificacionesRouter from "./notificaciones.router.js";
import servicioMedsRouter from "./serviciosMedRouter.js";
import MedicoRouter from "./MedicoRouter.js";

const v1Router = express.Router();

v1Router.use("/healthcheck", healthcheckRouter);
v1Router.use("/notificaciones", notificacionesRouter);
v1Router.use("/servicios", servicioMedsRouter);
// Acá es donde vamos a definir las rutas...
v1Router.use("/medicos",MedicoRouter)

export default v1Router;