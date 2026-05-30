import { NotificacionesController } from "./controllers/notificaciones.controller.js";
import { NotificacionesService } from "./services/notificaciones.service.js";
import { NotificacionesRepository } from "./domain/models/repositories/notificaciones.repository.js";
import { NotificacionesRouter } from "./routes/routers/v1/notificaciones.router.js";
import v1Router from "./routes/routers/v1/v1.router.js";

export default function initNotificaciones() {
    const repository = new NotificacionesRepository();
    const service = new NotificacionesService(repository);
    const controller = new NotificacionesController(service);
    const router = new NotificacionesRouter(controller);
    
    v1Router.use("/notificaciones", router.getRouter());
}
