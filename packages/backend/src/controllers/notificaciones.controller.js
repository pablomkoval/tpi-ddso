import { createNotificacionSchema } from "../validators/notificacion.schema.zod.js";

export class NotificacionesController {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }

    async findAllPaginated(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const notificaciones = await this.notificacionesService.findAllPaginated(page, limit);
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    async obtenerLeidas(req, res, next) {
        try {
            const userId = req.query.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;

            if (!userId) {
                return res.status(400).json({ error: "Se requiere userId en los query params" });
            }

            const notificaciones = await this.notificacionesService.obtenerLeidas(userId, page, limit);
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    async obtenerNoLeidas(req, res, next) {
        try {
            const userId = req.query.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;

            if (!userId) {
                return res.status(400).json({ error: "Se requiere userId en los query params" });
            }

            const notificaciones = await this.notificacionesService.obtenerNoLeidas(userId, page, limit);
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const validatedData = createNotificacionSchema.parse(req.body);

            const notificacion = await this.notificacionesService.create(validatedData);

            res.status(201).json(notificacion);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const notificacion = await this.notificacionesService
                .findById(req.params.id);
            res.json(notificacion);
        } catch (error) {
            next(error);
        }
    }

    async marcarComoLeida(req, res, next) {
        try {
            const notificacion = await this.notificacionesService
                .marcarComoLeida(req.params.id);

            res.json(notificacion);
        } catch (error) {
            next(error);
        }
    }

    async softDelete(req, res, next) {
        try {
            const notificacion = await this.notificacionesService
                .softDelete(req.params.id);

            res.json(notificacion)
        } catch (error) {
            next(error)
        }
    }
}