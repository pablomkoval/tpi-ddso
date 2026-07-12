import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";

export class SolicitudCambioTurnoRouter {
  constructor(controller) {
    this.controller = controller;
    this.solicitudCambioTurnoRouter = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    /**
     * @swagger
     * /solicitudes-cambio:
     *  post:
     *    summary: Crear una nueva solicitud de cambio de turno
     *    tags: [Solicitudes Cambio Turno]
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              turnoId:
     *                type: string
     *                example: '664b44e13e84f7d123e92ba9'
     *              nuevaFechaHora:
     *                type: string
     *                format: 'date-time'
     *                example: '2026-06-10T15:00:00.000Z'
     *    responses:
     *      201:
     *        description: Solicitud de cambio creada correctamente
     */
    this.solicitudCambioTurnoRouter.get("/", (req, res, next) =>
      this.controller.listar(req, res, next),
    );

    this.solicitudCambioTurnoRouter.post("/", verifyToken, (req, res, next) =>
      this.controller.crearSolicitud(req, res, next),
    );

    /**
     * @swagger
     * /solicitudes-cambio/{id}:
     *  get:
     *    summary: Obtener una solicitud de cambio de turno por su ID
     *    tags: [Solicitudes Cambio Turno]
     *    parameters:
     *      - name: id
     *        in: path
     *        required: true
     *        schema:
     *          type: string
     *          description: ID único de la solicitud en MongoDB
     *    responses:
     *      200:
     *        description: Detalles de la solicitud de cambio retornados correctamente
     */
    this.solicitudCambioTurnoRouter.get("/:id", (req, res, next) =>
      this.controller.obtenerPorId(req, res, next),
    );

    /**
     * @swagger
     * /solicitudes-cambio/{id}/confirmar:
     *  patch:
     *    summary: Confirmar una solicitud de cambio de turno
     *    tags: [Solicitudes Cambio Turno]
     *    parameters:
     *      - name: id
     *        in: path
     *        required: true
     *        schema:
     *          type: string
     *    responses:
     *      200:
     *        description: Solicitud confirmada y aprobada correctamente
     */
    this.solicitudCambioTurnoRouter.patch("/:id/confirmar", verifyToken, (req, res, next) =>
      this.controller.confirmar(req, res, next),
    );

    /**
     * @swagger
     * /solicitudes-cambio/{id}/rechazar:
     *  patch:
     *    summary: Rechazar una solicitud de cambio de turno
     *    tags: [Solicitudes Cambio Turno]
     *    parameters:
     *      - name: id
     *        in: path
     *        required: true
     *        schema:
     *          type: string
     *    responses:
     *      200:
     *        description: Solicitud rechazada de forma exitosa
     */
    this.solicitudCambioTurnoRouter.patch("/:id/rechazar", verifyToken, (req, res, next) =>
      this.controller.rechazar(req, res, next),
    );
  }

  getRouter() {
    return this.solicitudCambioTurnoRouter;
  }
}
