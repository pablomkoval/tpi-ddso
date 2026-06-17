import express from "express";
import healthcheckRouter from "./routers/healthcheck.router.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
//import notificacionesRouter from "./routers/notificaciones.router.js";
/* import serviciosRouter from "./routers/servicio.router.js";
import medicoRouter from "./routers/medico.router.js";
import turnoRouter from "./routers/turno.router.js";
 */
const router = express.Router();

// Ruta pública - no requiere autenticación
router.use("/healthcheck", healthcheckRouter);

// Rutas protegidas - requieren token de Keycloak válido
// Para proteger una ruta, agrega el middleware verifyToken antes del router:
//   router.use("/notificaciones", verifyToken, notificacionesRouter);
//   router.use("/servicios", verifyToken, serviciosRouter);
//   router.use("/medicos", verifyToken, medicoRouter);
//   router.use("/turnos", verifyToken, turnoRouter);

//router.use("/notificaciones", verifyToken, notificacionesRouter);
//router.use("/servicios", verifyToken, serviciosRouter);
//router.use("/medicos", verifyToken, medicoRouter);
//router.use("/turnos", verifyToken, turnoRouter);

export default router;