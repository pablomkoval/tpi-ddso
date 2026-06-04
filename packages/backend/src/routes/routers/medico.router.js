import express from "express";

export class MedicoRouter {
    constructor(controller) {
        this.controller = controller;
        this.medicoRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        /**
         * @swagger
         * /medicos:
         *  get:
         *      summary: Obtener la lista de todos los médicos
         *      tags: [Medicos]
         *      responses:
         *          200:
         *              description: Lista de médicos obtenida correctamente
         *  post:
         *      summary: Crear un nuevo médico base
         *      tags: [Medicos]
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      required: [usuario, matricula, nombre]
         *                      properties:
         *                          usuario: { type: string, example: '664b44e13e84f7d123e92000' }
         *                          matricula: { type: string, example: 'MN-98765' }
         *                          nombre: { type: string, example: 'Dr. Joaquín Coelli' }
         *      responses:
         *          201:
         *              description: Médico creado exitosamente
         */
        this.medicoRouter.get("/", (req, res, next) => { this.controller.findAll(req, res, next); }); //findAllPaginated
        this.medicoRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });

        /**
         * @swagger
         * /medicos/{idMedico}:
         *  get:
         *      summary: Obtener un médico por id
         *      tags: [Medicos]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *              description: ID único del médico en MongoDB
         *      responses:
         *          200:
         *              description: Médico encontrado de forma correcta
         *          404:
         *              description: Médico no encontrado
         */
        this.medicoRouter.get("/:idMedico", (req, res, next) => { this.controller.findById(req, res, next); });
        //método patch si hacemos disponibilidades sin path

        /**
         * @swagger
         * /medicos/{idMedico}/disponibilidades:
         *  get:
         *      summary: Obtener disponibilidades horarias de un médico
         *      tags: [Medicos - Disponibilidades]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      responses:
         *          200:
         *              description: Lista de disponibilidades horarias obtenida correctamente
         *          404:
         *              description: Médico no encontrado
         *  post:
         *      summary: Agregar nuevas disponibilidades horarias a un médico
         *      tags: [Medicos - Disponibilidades]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      required: [disponibilidades]
         *                      properties:
         *                          disponibilidades:
         *                              type: array
         *                          items:
         *                              type: object
         *                              required: [diaSemana, horaDesde, horaHasta, sede, prestacion]
         *                              properties:
         *                                  diaSemana: { type: number, example: 1 }
         *                                  horaDesde: { type: string, example: '08:00' }
         *                                  horaHasta: { type: string, example: '12:00' }
         *                                  sede: { type: string, example: '664b44e13e84f7d123e92002' }
         *                                  prestacion: { type: string, example: '664b44e13e84f7d123e92001' }
         *      responses:
         *          200:
         *              description: Disponibilidades agregadas con éxito
         */
        this.medicoRouter.get("/:idMedico/disponibilidades", (req, res, next) => { this.controller.obtenerDisponibilidades(req, res, next); });
        this.medicoRouter.get("/:idMedico/disponibilidades/:idPrestacion", (req, res, next) => { this.controller.obtenerDisponibilidadesSegunPrestacion(req, res, next); });
        this.medicoRouter.post("/:idMedico/disponibilidades", (req, res, next) => { this.controller.agregarDisponibilidades(req, res, next); });

        /**
         * @swagger
         * /medicos/{idMedico}/disponibilidades/{disponibilidadId}:
         *  patch:
         *      summary: Editar una disponibilidad horaria específica de un médico
         *      tags: [Medicos - Disponibilidades]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *        - name: disponibilidadId
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          diaSemana: { type: number, example: 1 }
         *                          horaDesde: { type: string, example: '10:00' }
         *                          horaHasta: { type: string, example: '11:00' }
         *      responses:
         *          200:
         *              description: Disponibilidad modificada exitosamente
         *  delete:
         *      summary: Eliminar una disponibilidad horaria por id
         *      tags: [Medicos - Disponibilidades]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *        - name: disponibilidadId
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      responses:
         *          200:
         *              description: Disponibilidad eliminada correctamente
         */
        this.medicoRouter.patch("/:idMedico/disponibilidades/:disponibilidadId", (req, res, next) => { this.controller.editarDisponibilidad(req, res, next); });
        this.medicoRouter.delete("/:idMedico/disponibilidades/:disponibilidadId", (req, res, next) => { this.controller.eliminarDisponibilidad(req, res, next); });

        /**
         * @swagger
         * /medicos/{idMedico}/prestaciones:
         *  get:
         *      summary: Obtener las prestaciones que ofrece un médico específico
         *      tags: [Medicos - Prestaciones]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      responses:
         *          200:
         *              description: Lista de prestaciones obtenida correctamente
         *  post:
         *      summary: Dar de alta un servicio médico (Especialidad/Práctica) para un médico
         *      tags: [Medicos - Prestaciones]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      required: [servicioUnico, costo, duracionTurnoEnMins, tipoServicio]
         *                      properties:
         *                          servicioUnico: { type: string, example: '664b44e13e84f7d123e92001' }
         *                          duracionTurnoEnMins: { type: number, example: 30 }
         *                          costo: { type: number, example: 15000 }
         *                          tipoServicio: { type: string, enum: [especialidad, practica], example: 'especialidad' }
         *                          codigo: { type: string, example: 'PRAC-01' }
         *      responses:
         *          201:
         *              description: Servicio asociado al médico exitosamente
         */
        this.medicoRouter.get("/:idMedico/prestaciones", (req, res, next) => { this.controller.obtenerPrestaciones(req, res, next); });
        this.medicoRouter.post("/:idMedico/prestaciones", (req, res, next) => { this.controller.altaPrestacion(req, res, next); });

        /**
         * @swagger
         * /medicos/{idMedico}/prestaciones/{idPrestacion}:
         *  get:
         *      summary: Obtener la información de un servicio específico prestado por el médico
         *      tags: [Medicos - Prestaciones]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *        - name: idPrestacion
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      responses:
         *          200:
         *              description: Información del servicio obtenida correctamente
         *  patch:
         *      summary: Modificar servicio de un médico en específico
         *      tags: [Medicos - Prestaciones]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *        - name: idPrestacion
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          costo: { type: number, example: 17500 }
         *      responses:
         *          200:
         *              description: Servicio del médico actualizado correctamente
         *  delete:
         *      summary: Dar de baja un servicio específico de la lista de un médico (Borrado lógico)
         *      tags: [Medicos - Prestaciones]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *        - name: idPrestacion
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      responses:
         *          201:
         *              description: Servicio eliminado del médico correctamente
         */
        this.medicoRouter.get("/:idMedico/prestaciones/:idPrestacion", (req, res, next) => { this.controller.obtenerPrestacionPorId(req, res, next); });
        this.medicoRouter.patch("/:idMedico/prestaciones/:idPrestacion", (req, res, next) => { this.controller.editarPrestacion(req, res, next); });
        this.medicoRouter.delete("/:idMedico/prestaciones/:idPrestacion", (req, res, next) => { this.controller.bajaPrestacion(req, res, next); });

        /**
         * @swagger
         * /medicos/{idPaciente}/turnos:
         *  get:
         *      summary: Consultar el historial de turnos de un paciente desde el perfil del médico
         *      tags: [Medicos - Gestión Turnos]
         *      parameters:
         *        - name: idPaciente
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *              description: ID del paciente a consultar
         *      responses:
         *          200:
         *              description: Historial de consultas del paciente retornado con éxito
         */
        this.medicoRouter.get("/:idPaciente/turnos", (req, res, next) => { this.controller.consultarHistorialPaciente(req, res, next); });

        /**
         * @swagger
         * /medicos/{idMedico}/turnos/{turnoId}/realizados:
         *  post:
         *      summary: Marcar un turno médico como realizado/completado
         *      tags: [Medicos - Gestión Turnos]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *        - name: turnoId
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      responses:
         *          200:
         *              description: Turno registrado como completado correctamente
         */
        this.medicoRouter.post("/:idMedico/turnos/:turnoId/realizados", (req, res, next) => { this.controller.realizarTurno(req, res, next); });

        /**
         * @swagger
         * /medicos/{idMedico}/turnos/:turnoId/cancelaciones:
         *  post:
         *      summary: Cancelar un turno desde la agenda del médico
         *      tags: [Medicos - Gestión Turnos]
         *      parameters:
         *        - name: idMedico
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *        - name: turnoId
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  properties:
         *                      motivoCambio:
         *                          type: string
         *                          example: 'Urgencia en quirófano'
         *      responses:
         *          200:
         *              description: Turno cancelado por el profesional de forma exitosa
         */
        this.medicoRouter.post("/:idMedico/turnos/:turnoId/cancelaciones", (req, res, next) => { this.controller.cancelarTurno(req, res, next); });
    }

    getRouter() {
        return this.medicoRouter;
    }
}

//import MedicoController from "../../controllers/medico.controller.js";

/* const medicoRouter = express.Router();
const medicoController = new MedicoController();

medicoRouter.route('/')
    .get((req, res, next) => medicoController.findAll(req, res, next))
    .post((req, res, next) => medicoController.create(req, res, next))

medicoRouter.route('/:idMedico')
    .get((req, res, next) => medicoController.findById(req, res, next))
    //patch((req,res,next)) => medicoController.updateMedico(req, res, next))

medicoRouter.route('/:idMedico/disponibilidades')
    .get((req, res, next) => medicoController.obtenerDisponibilidades(req, res, next))
    .post((req, res, next) => medicoController.agregarDisponibilidades(req, res, next))

medicoRouter.route("/:idMedico/disponibilidades/:disponibilidadId")
    .patch((req, res, next) => medicoController.editarDisponibilidad(req, res, next))
    .delete((req, res, next) => medicoController.eliminarDisponibilidad(req, res, next))

medicoRouter.route('/:idMedico/servicios')
    .get((req, res, next) => medicoController.obtenerPrestaciones(req, res, next))
    .post((req, res, next) => medicoController.altaPrestacion(req, res, next))

medicoRouter.route('/:idMedico/servicios/:idPrestacion')
    .get((req, res, next) => medicoController.obtenerPrestacionPorId(req, res, next))
    .patch((req, res, next) => medicoController.editarPrestacion(req, res, next))
    .delete((req, res, next) => medicoController.bajaPrestacion(req, res, next))

export default medicoRouter; */

