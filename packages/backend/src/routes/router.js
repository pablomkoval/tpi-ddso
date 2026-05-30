import express from "express";
import healthcheckRouter from "./routers/healthcheck.router.js";
import notificacionesRouter from "./routers/notificaciones.router.js";
import serviciosRouter from "./routers/servicio.router.js";
import medicoRouter from ".//routers/medico.router.js";
import turnoRouter from "./routers/turno.router.js";

const router = express.Router();

router.use("/healthcheck", healthcheckRouter);
router.use("/notificaciones", notificacionesRouter);
router.use("/servicios", serviciosRouter);
router.use("/medicos", medicoRouter)
router.use("/turnos", turnoRouter);

export default router;