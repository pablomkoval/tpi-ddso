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
import { PacienteRepository } from "./domain/models/repositories/paciente.repository.js";
import { PacienteService } from "./services/paciente.service.js";
import { PacienteController } from "./controllers/paciente.controller.js";
import { ServicioRouter } from "./routes/routers/servicio.router.js";
import { TurnoRouter } from "./routes/routers/turno.router.js";
import { PacienteRouter } from "./routes/routers/paciente.router.js";
import { MedicoRouter } from "./routes/routers/medico.router.js";

export default function inyectarDependenciasYRouter(routerGeneral) {
    //////////////////////////////// REPOSITORYS /////////////////////////////////////////////////////////////
    const notiRepository = new NotificacionesRepository();
    const servicioRepository = new ServicioRepository();
    const prestacionRepository = new PrestacionRepository();
    const turnoRepository = new TurnoRepository();
    const usuarioRepository = new UsuarioRepository(); //definir si se usa realmente (aplicar cambio a inyecciones abajo)
    const medicoRepository = new MedicoRepository();
    const pacienteRepository = new PacienteRepository();

    //////////////////////////////// SERVICES /////////////////////////////////////////////////////////////
    const notiService = new NotificacionesService(notiRepository);
    const servicioService = new ServicioService(servicioRepository, prestacionRepository);
    const pacienteService = new PacienteService(pacienteRepository, usuarioRepository);
    const medicoService = new MedicoService(medicoRepository, servicioService, usuarioRepository);
    const turnoService = new TurnoService(turnoRepository, medicoService, pacienteService, servicioService);

    //////////////////////////////// CONTROLLERS /////////////////////////////////////////////////////////////
    const notiController = new NotificacionesController(notiService);
    const servicioController = new ServiciosController(servicioService);
    const turnoController = new TurnoController(turnoService);
    const pacienteController = new PacienteController(pacienteService);
    const medicoController = new MedicoController(medicoService);

    //////////////////////////////// ROUTERS /////////////////////////////////////////////////////////////

    const notiRouter = new NotificacionesRouter(notiController);
    const servicioRouter = new ServicioRouter(servicioController);
    const turnoRouter = new TurnoRouter(turnoController);
    const pacienteRouter = new PacienteRouter(pacienteController);
    const medicoRouter = new MedicoRouter(medicoController);

    routerGeneral.use("/medicos", medicoRouter.getRouter())
    routerGeneral.use("/pacientes", pacienteRouter.getRouter())
    routerGeneral.use("/turnos", turnoRouter.getRouter())
    routerGeneral.use("/notificaciones", notiRouter.getRouter())
    routerGeneral.use("/servicios", servicioRouter.getRouter())
}

