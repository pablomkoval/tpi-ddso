import { NotFoundError } from '../shared/errors/AppError.js';
import { ValidationError } from '../shared/errors/AppError.js';
import { Notificacion } from '../domain/models/entities/turnos/Notificacion.js'

export class NotificacionesService {
    constructor(notificacionesRepository) {
    this.notificacionesRepository = notificacionesRepository;
    }


    async obtenerLeidas (userId, page, limit) {
        const criterios = { destinatario: userId, leida: true };
        return await this.notificacionesRepository.findAllPaginated(criterios, page, limit);
    }

    async obtenerNoLeidas (userId, page, limit) {
        const criterios = { destinatario: userId, leida: false };
        return await this.notificacionesRepository.findAllPaginated(criterios, page, limit);
    }

    async create(data) {
        const {destinatario, remitente, mensaje} = data;

        if(!destinatario || !remitente || !mensaje) {
            throw new ValidationError("Los datos para la notificacion no son validos");
        }

        const nueva = new Notificacion(destinatario, remitente, mensaje);
        const notificacionGuardada = await this.notificacionesRepository.save(nueva);

        return notificacionGuardada;
    }

    async marcarComoLeida(notificacionId) {
        const notificacion = await this.notificacionesRepository.findById(notificacionId);

        if (!notificacion) {
            throw new NotFoundError("Notificacion no encontrada");
        }

        notificacion.marcarComoLeida();

        const actualizada = await this.notificacionesRepository.update(notificacionId, { 
            leida: notificacion.leida,
            fechaHoraLeida: notificacion.fechaHoraLeida
        });

        return actualizada;
    }

    async softDelete(notificacionId) {
        return await this.notificacionesRepository.softDelete(notificacionId);
    }

    async findAllPaginated(page, limit) {
        return await this.notificacionesRepository.findAllPaginated({}, page, limit);
    }
}