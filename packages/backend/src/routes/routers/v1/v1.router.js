import express from "express";
import healthcheckRouter from "./healthcheck.router.js";
import MedicoRouter from "./MedicoRouter.js";

const v1Router = express.Router();

v1Router.use("/healthcheck", healthcheckRouter);

// Acá es donde vamos a definir las rutas...
v1Router.use("/medicos", MedicoRouter)

export default v1Router;