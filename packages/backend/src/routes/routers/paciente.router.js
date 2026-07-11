import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";

export class PacienteRouter {
    constructor(controller) {
        this.controller = controller;
        this.pacienteRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        /**
         *  @swagger
         * /pacientes:
         *  post:
         *      summary: Dar de alta un nuevo paciente
         *      tags: [Pacientes]
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          usuario:
         *                              type: string
         *                              example: 'gabi123'
         *                          dni:
         *                              type: string
         *                              example: '45123899'
         *                          nombre:
         *                              type: string
         *                              example: 'Gabriel Toledo'
         *                          obraSocial:
         *                              type: string
         *                              example: 'OSDE'
         *                          plan:
         *                              type: string
         *                              example: '210'
         *      responses:
         *          201:
         *              description: Paciente registrado exitosamente
         *          200:
         *              description: Lista de pacientes obtenida correctamente
         *  get:
         *      summary: Listar todos los pacientes
         *      tags: [Pacientes]
         *      responses:
         *          200:
         *              description: Lista de pacientes obtenida correctamente
         */
        this.pacienteRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });
        this.pacienteRouter.get("/", (req, res, next) => { this.controller.findAll(req, res, next); });
        this.pacienteRouter.get("/me", verifyToken, (req, res, next) => { this.controller.findMe(req, res, next); });
        
        /**
         * @swagger
         * /pacientes/{idPaciente}:
         *  get:
         *      summary: Buscar un paciente por ID
         *      tags: [Pacientes]
         *      parameters:
         *        - name: idPaciente
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *              description: ID único del paciente en MongoDB
         *      responses:
         *          200:
         *              description: Paciente retornado de forma correcta
         *  put:
         *      summary: Actualizar datos de un paciente
         *      tags: [Pacientes]
         *      parameters:
         *        - name: idPaciente
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
         *                          obraSocial:
         *                              type: string
         *                              example: 'OSDE'
         *                          plan:
         *                              type: string
         *                              example: '310'
         *      responses:
         *          200:
         *              description: Paciente actualizado correctamente
         */
        this.pacienteRouter.get("/:idPaciente", (req, res, next) => { this.controller.findById(req, res, next); });
        this.pacienteRouter.put("/:idPaciente", (req, res, next) => { this.controller.update(req, res, next); });



        // Rutas del ciclo de vida de los turnos del paciente //



        /**
         * @swagger
         * /pacientes/{idPaciente}/turnos:
         *  get:
         *      summary: Consultar historial de turnos de un paciente
         *      tags: [Pacientes - Flujo Turnos]
         *      parameters:
         *        - name: idPaciente
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *      responses:
         *          200:
         *              description: Historial de turnos obtenido correctamente
         */
        this.pacienteRouter.get("/:idPaciente/turnos", verifyToken, (req, res, next) => { this.controller.consultarHistorial(req, res, next); });

  
        /**
         * @swagger
         * /pacientes/{idPaciente}/turnos/{turnoId}/cambios:
         *  post:
         *      summary: Solicitar un cambio de fecha/hora para un turno asignado
         *      tags: [Pacientes - Flujo Turnos]
         *      parameters:
         *        - name: idPaciente
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
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: object
         *                      properties:
         *                          nuevaFechaHora:
         *                              type: string
         *                              format: 'date-time'
         *                              example: '2026-06-15T10:30:00.000Z'
         *      responses:
         *          201:
         *              description: Solicitud de cambio registrada con éxito
         */
        this.pacienteRouter.post("/:idPaciente/turnos/:turnoId/cambios", verifyToken, (req, res, next) => { this.controller.solicitarCambioFecha(req, res, next); });
    }

    getRouter() {
        return this.pacienteRouter;
    }
}
