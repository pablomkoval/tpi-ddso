import express from "express";
import healthcheckRouter from "./healthcheck.router.js";
import notificacionesRouter from "./notificaciones.router.js";

const v1Router = express.Router();

v1Router.use("/healthcheck", healthcheckRouter);
v1Router.use("/notificaciones", notificacionesRouter);

// Acá es donde vamos a definir las rutas...

export default v1Router;