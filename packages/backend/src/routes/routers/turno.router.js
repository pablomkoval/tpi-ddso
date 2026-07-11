import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";


export class TurnoRouter {
    constructor(controller) {
        this.controller = controller;
        this.turnoRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        /**
         * @swagger
         * /turnos/disponibles:
         *  get:
         *    summary: Obtener el listado de todos los turnos médicos disponibles
         *    tags: [Turnos]
         *    parameters:
         *      - name: prestacion
         *        in: query
         *        required: true
         *        schema:
         *          type: string
         *          description: ID de la prestación a buscar
         *      - name: profesional
         *        in: query
         *        schema:
         *          type: string
         *          description: ID opcional del médico
         *      - name: paciente
         *        in: query
         *        required: true
         *        schema:
         *          type: string
         *          description: ID del paciente para calcular cobertura de obra social
         *    responses:
         *      200:
         *        description: Lista de turnos disponibles obtenida de manera correcta
         *      400:
         *        description: Falta especificar filtros obligatorios
         */
        this.turnoRouter.get("/disponibles", (req, res, next) => { this.controller.getDisponibles(req, res, next); });

        /**
         * @swagger
         * /turnos/{id}:
         *  get:
         *    summary: Obtener un turno médico específico por su Id
         *    tags: [Turnos]
         *    parameters:
         *      - name: id
         *        in: path
         *        required: true
         *        schema:
         *          type: string
         *          description: Id único del turno en MongoDB
         *    responses:
         *      200:
         *        description: Turno encontrado y devuelto correctamente
         *      404:
         *        description: El turno solicitado no existe
         */
        this.turnoRouter.get("/:id", (req, res, next) => { this.controller.getById(req, res, next); });
        this.turnoRouter.patch("/:id", verifyToken, (req, res, next) => { this.controller.cambiarEstado(req, res, next); });

    

        /**
         * @swagger
         * /turnos/{id}/estados:
         *  post:
         *      summary: Cambiar el estado del turno registrando el cambio en el historial
         *      tags: [Turnos]
         *      parameters:
         *        - name: id
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
         *                          nuevoEstado: { type: string, enum: ["DISPONIBLE", "RESERVADO", "CANCELADO", "COMPLETADO"], example: "COMPLETADO" }
         *                          quien: { type: string, example: 'Admin-Sweet' }
         *                          motivoCambio: { type: string, example: 'Atención realizada con éxito' }
         *      responses:
         *          200:
         *              description: Estado actualizado e ingresado al historial de estados
         */
        this.turnoRouter.patch("/:id/estados", (req, res, next) => { this.controller.cambiarEstado(req, res, next); });
    }

    getRouter() {
        return this.turnoRouter;
    }
}

