import express from "express";

export class SolicitudCambioTurnoRouter {
  constructor(controller) {
    this.controller = controller;
    this.solicitudCambioTurnoRouter = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.solicitudCambioTurnoRouter.post("/", (req, res, next) =>
      this.controller.crearSolicitud(req, res, next),
    );
    this.solicitudCambioTurnoRouter.get("/:id", (req, res, next) =>
      this.controller.obtenerPorId(req, res, next),
    );
    this.solicitudCambioTurnoRouter.patch("/:id/confirmar", (req, res, next) =>
      this.controller.confirmar(req, res, next),
    );
    this.solicitudCambioTurnoRouter.patch("/:id/rechazar", (req, res, next) =>
      this.controller.rechazar(req, res, next),
    );
  }

  getRouter() {
    return this.solicitudCambioTurnoRouter;
  }
}
