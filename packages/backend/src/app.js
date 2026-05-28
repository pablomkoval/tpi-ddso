import express from "express";
import router from "./routes/router.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

// import { NotificacionesController } from "./controllers/notificaciones.controller.js";
// import { NotificacionesService } from "./services/notificaciones.service.js";
// import { NotificacionesRepository } from "./domain/models/repositories/notificaciones.repository.js";

const app = express();

app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(router);

export default app;


