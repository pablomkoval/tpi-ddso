import { NotificacionModel } from '../../../schemas/notificacion.schema.js';

export class NotificacionesRepository {
    constructor() {
        this.model = NotificacionModel;
    }

    async findAllPaginated(criterios = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const filtros = { ...criterios, eliminado: false };

        const notificaciones = await this.model
            .find(filtros)
            .sort({
                fechaHoraCreacion: -1
            })
            .skip(skip)
            .limit(limit);

        const total = await this.model.countDocuments(filtros);

        return {
            notificaciones,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }

    async count(criterios = {}) {
        return await this.model.countDocuments({
            ...criterios,
            eliminado: false,
        });
    }

    async marcarTodasComoLeidas(criterios = {}) {
        return await this.model.updateMany(
            {
                ...criterios,
                eliminado: false,
                leida: false
            },
            {
                $set: {
                    leida: true
                }
            }
        );
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async save(notificacion) {
        const nuevaNotificacion = new this.model(notificacion);
        return await nuevaNotificacion.save();
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
    }

    async softDelete(id) {
        return await this.model.findByIdAndUpdate(id,
            {
                eliminado: true
            },
            {
                new: true
            }
        )
    }
}