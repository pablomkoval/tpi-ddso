import { NotificacionesRepository } from '../domain/models/repositories/notificaciones.repository.js';
import { Notificacion } from '../domain/models/entities/turnos/Notificacion.js'

export class NotificacionesService {
    // constructor(notificacionesRepository) {
    //     this.notificacionesRepository = notificacionesRepository;
    // }
    constructor() {
        this.notificacionesRepository = new NotificacionesRepository();
    }


    toDTO(notificacion) {
        return {
            id: notificacion.id || notificacion._id,
            destinatario: notificacion.destinatario,
            remitente: notificacion.remitente,
            mensaje: notificacion.mensaje,
            leida: notificacion.leida,
            fechaHoraCreacion: notificacion.fechaHoraCreacion
        };
    }

    async obtenerLeidas (userId, page, limit) {
        const criterios = { destinatario: userId, leida: true };
        const resultado = await this.notificacionesRepository.findAllPaginated(criterios, page, limit);
        
        return {
            ...resultado,
            notificaciones: resultado.notificaciones.map(n => this.toDTO(n))
        };
    }

    async obtenerNoLeidas (userId, page, limit) {
        const criterios = { destinatario: userId, leida: false };
        const resultado = await this.notificacionesRepository.findAllPaginated(criterios, page, limit);
        
        return {
            ...resultado,
            notificaciones: resultado.notificaciones.map(n => this.toDTO(n))
        };
    }

    async create(data) {
        const {destinatario, remitente, mensaje} = data;

        if(!destinatario || !remitente || !mensaje) {
            //throw new ValidationError("Los datos para la notificacion no son validos");
        }

        const nueva = new Notificacion(destinatario, remitente, mensaje);
        const notificacionGuardada = await this.notificacionesRepository.save(nueva);

        return this.toDTO(notificacionGuardada);
    }

    async marcarComoLeida(notificacionId) {
        const notificacion = await this.notificacionesRepository.findById(notificacionId);

        if (!notificacion) {
            //throw new NotFoundError("Notificacion no encontrada");
        }

        notificacion.marcarComoLeida();

        const actualizada = await this.notificacionesRepository.update(notificacionId, { 
            leida: notificacion.leida,
            fechaHoraLeida: notificacion.fechaHoraLeida
        });

        return this.toDTO(actualizada);
    }

    async softDelete(notificacionId) {
        return await this.notificacionesRepository.softDelete(notificacionId);
    }

    async findAllPaginated(page, limit) {
        return await this.notificacionesRepository.findAllPaginated(page, limit);
    }
}