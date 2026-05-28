import express from "express";
import healthcheckRouter from "./healthcheck.router.js";
import notificacionesRouter from "./notificaciones.router.js";
import serviciosRouter from "./serviciosRouter.js";
import medicoRouter from "./medicoRouter.js";
import turnoRouter from "./turnoRouter.js";

const v1Router = express.Router();

v1Router.use("/healthcheck", healthcheckRouter);
v1Router.use("/notificaciones", notificacionesRouter);
v1Router.use("/servicios", serviciosRouter);
// Acá es donde vamos a definir las rutas...
v1Router.use("/medicos", medicoRouter)

v1Router.use("/turnos", turnoRouter);

export default v1Router;