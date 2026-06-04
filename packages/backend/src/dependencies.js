import { NotificacionesController } from "./controllers/notificaciones.controller.js";
import { NotificacionesService } from "./services/notificaciones.service.js";
import { NotificacionesRepository } from "./domain/models/repositories/notificaciones.repository.js";
import { NotificacionesRouter } from "./routes/routers/notificaciones.router.js";
import { MedicoRepository } from "./domain/models/repositories/medico.repository.js";
import { MedicoService } from "./services/medico.service.js";
import { UsuarioRepository } from "./domain/models/repositories/usuario.repository.js";
import { MedicoController } from "./controllers/medico.controller.js";
import { ServicioRepository } from "./domain/models/repositories/servicio.repository.js";
import { PrestacionRepository } from "./domain/models/repositories/prestacion.repository.js";
import { ServicioService } from "./services/servicio.service.js";
import { ServiciosController } from "./controllers/servicios.controller.js";
import { TurnoRepository } from "./domain/models/repositories/turno.repository.js";
import { TurnoService } from "./services/turno.service.js";
import { TurnoController } from "./controllers/turno.controller.js";
import { SolicitudCambioTurnoRepository } from "./domain/models/repositories/solicitudCambioTurno.repository.js";
import { SolicitudCambioTurnoService } from "./services/solicitudCambioTurno.service.js";
import { SolicitudCambioTurnoController } from "./controllers/solicitudCambioTurno.controller.js";
import { PacienteRepository } from "./domain/models/repositories/paciente.repository.js";
import { PacienteService } from "./services/paciente.service.js";
import { PacienteController } from "./controllers/paciente.controller.js";
import { ServicioRouter } from "./routes/routers/servicio.router.js";
import { TurnoRouter } from "./routes/routers/turno.router.js";
import { SolicitudCambioTurnoRouter } from "./routes/routers/solicitudCambioTurno.router.js";
import { PacienteRouter } from "./routes/routers/paciente.router.js";
import { MedicoRouter } from "./routes/routers/medico.router.js";
import { SedeRepository } from "./domain/models/repositories/sede.repository.js";
import { SedeService } from "./services/sede.service.js";
import { SedeController } from "./controllers/sede.controller.js";
import { SedeRouter } from "./routes/routers/sede.router.js";

//////////////////////////////// REPOSITORYS /////////////////////////////////////////////////////////////
const notiRepository = new NotificacionesRepository();
const servicioRepository = new ServicioRepository();
const prestacionRepository = new PrestacionRepository();
const turnoRepository = new TurnoRepository();
const solicitudCambioTurnoRepository = new SolicitudCambioTurnoRepository();
const usuarioRepository = new UsuarioRepository(); //definir si se usa realmente (aplicar cambio a inyecciones abajo)
const medicoRepository = new MedicoRepository();
const pacienteRepository = new PacienteRepository();
const sedeRepository = new SedeRepository();

//////////////////////////////// SERVICES /////////////////////////////////////////////////////////////
const notiService = new NotificacionesService(notiRepository);
const servicioService = new ServicioService(servicioRepository, prestacionRepository);
const pacienteService = new PacienteService(pacienteRepository, turnoRepository, notiService, solicitudCambioTurnoRepository);
const medicoService = new MedicoService(medicoRepository, servicioService, usuarioRepository, turnoRepository);
export const turnoService = new TurnoService(turnoRepository, medicoService, pacienteService, servicioService);
const solicitudCambioTurnoService = new SolicitudCambioTurnoService(solicitudCambioTurnoRepository, turnoRepository /* se debe comunicar con turnoService en todo caso */);
const sedeService = new SedeService(sedeRepository);

//////////////////////////////// CONTROLLERS /////////////////////////////////////////////////////////////
const notiController = new NotificacionesController(notiService);
const servicioController = new ServiciosController(servicioService);
const turnoController = new TurnoController(turnoService);
const solicitudCambioTurnoController = new SolicitudCambioTurnoController(solicitudCambioTurnoService);
const pacienteController = new PacienteController(pacienteService);
const medicoController = new MedicoController(medicoService);
const sedeController = new SedeController(sedeService);

//////////////////////////////// ROUTERS /////////////////////////////////////////////////////////////
const notiRouter = new NotificacionesRouter(notiController);
const servicioRouter = new ServicioRouter(servicioController);
const turnoRouter = new TurnoRouter(turnoController);
const solicitudCambioTurnoRouter = new SolicitudCambioTurnoRouter(solicitudCambioTurnoController)
const pacienteRouter = new PacienteRouter(pacienteController);
const medicoRouter = new MedicoRouter(medicoController);
const sedeRouter = new SedeRouter(sedeController);

export default function inyectarDependenciasYRouter(routerGeneral) {
    routerGeneral.use("/medicos", medicoRouter.getRouter())
    routerGeneral.use("/pacientes", pacienteRouter.getRouter())
    routerGeneral.use("/turnos", turnoRouter.getRouter())
    routerGeneral.use("/solicitudes-cambio", solicitudCambioTurnoRouter.getRouter())
    routerGeneral.use("/notificaciones", notiRouter.getRouter())
    routerGeneral.use("/servicios", servicioRouter.getRouter())
    routerGeneral.use("/sedes", sedeRouter.getRouter())
}

