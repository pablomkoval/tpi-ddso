import { NotificacionModel } from '../../../schemas/notificacionSchema.js';

export class NotificacionesRepository {
    constructor() {
        this.model = NotificacionModel;
    }
    
    async findAll() {
        return await this.model.find({eliminada: false});
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

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

}