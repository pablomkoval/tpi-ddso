import express from "express";
import healthcheckRouter from "./healthcheck.router.js";
import turnoRouter from "./turno.router.js";

const v1Router = express.Router();

v1Router.use("/healthcheck", healthcheckRouter);
v1Router.use("/turnos", turnoRouter);

export default v1Router;