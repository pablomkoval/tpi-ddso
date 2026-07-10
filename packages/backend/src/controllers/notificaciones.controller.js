import { createNotificacionSchema } from "../validators/notificacion.schema.zod.js";

export class NotificacionesController {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }

    notificacionToDTO(notificacion) {
        return {
            id: notificacion.id || notificacion._id,
            destinatario: notificacion.destinatario,
            remitente: notificacion.remitente,
            mensaje: notificacion.mensaje,
            leida: notificacion.leida,
            fechaHoraCreacion: notificacion.fechaHoraCreacion,
            tipo: notificacion.tipo || "INFO",
            referenciaId: notificacion.referenciaId || null
        };
    }

    async findAllPaginated(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const criterios = {
                destinatario: req.user.id
            };

            if (req.query.leida !== undefined) {
                criterios.leida = req.query.leida ==="true";
            }
            const resultado = await this.notificacionesService.findAllPaginated(
                page,
                limit,
                criterios
            );

            res.json({
                ...resultado,
                notificaciones: resultado.notificaciones.map(n => this.notificacionToDTO(n))
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const validatedData = createNotificacionSchema.parse(req.body);

            const notificacion = await this.notificacionesService.create(validatedData);

            res.status(201).json(this.notificacionToDTO(notificacion));
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const notificacion = await this.notificacionesService
                .findById(req.params.id);
            res.json(this.notificacionToDTO(notificacion));
        } catch (error) {
            next(error);
        }
    }

    async marcarComoLeida(req, res, next) {
        try {
            const notificacion = await this.notificacionesService
                .marcarComoLeida(req.params.id);

            res.json(this.notificacionToDTO(notificacion));
        } catch (error) {
            next(error);
        }
    }

    async softDelete(req, res, next) {
        try {
            const notificacion = await this.notificacionesService
                .softDelete(req.params.id);

            res.json(this.notificacionToDTO(notificacion))
        } catch (error) {
            next(error)
        }
    }

    async count(req, res, next) {
        try {
            const criterios = {
                destinatario: req.user.id
            };

            if (req.query.leida !== undefined) {
                criterios.leida = req.query.leida === "true";
            }

            const cantidad = await this.notificacionesService.count(
                criterios
            );

            res.json({
                cantidad
            });

        } catch (error) {
            next(error);
        }
    }

    async resumen(req, res, next) {
        try {
            const resumen =
                await this.notificacionesService.obtenerResumen(req.user.id);

            res.json(resumen);

        } catch (error) {
            next(error);
        }
    }

    async marcarTodasComoLeidas(req, res, next) {
        try {
            const resultado =
                await this.notificacionesService
                    .marcarTodasComoLeidas(req.user.id);

            res.json(resultado);

        } catch (error) {
            next(error);
        }
    }
}