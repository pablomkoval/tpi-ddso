import { NotificacionesController } from "./controllers/notificaciones.controller.js";
import { NotificacionesService } from "./services/notificaciones.service.js";
import { NotificacionesRepository } from "./domain/models/repositories/notificaciones.repository.js";
import { NotificacionesRouter } from "./routes/routers/v1/notificaciones.router.js";
import router from "./routes/router.js";

export default function initNotificaciones() {
    const repository = new NotificacionesRepository();
    const service = new NotificacionesService(repository);
    const controller = new NotificacionesController(service);
    const routerNotificaciones = new NotificacionesRouter(controller);
    
    router.use("/notificaciones", routerNotificaciones.getRouter());
}
