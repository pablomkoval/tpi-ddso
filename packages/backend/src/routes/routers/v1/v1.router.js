import express from "express";
import healthcheckRouter from "./healthcheck.router.js";

const v1Router = express.Router();

v1Router.use("/healthcheck", healthcheckRouter);

// Acá es donde vamos a definir las rutas...

export default v1Router;