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

    async findAll() {
        const notificaciones = await this.notificacionesRepository.findAll();
        return notificaciones.map(n => this.toDTO(n));
    }

    async obtenerLeidas (userId) {
        const notificaciones = await this.notificacionesRepository.getLeidas(userId);
        return notificaciones.map(n => this.toDTO(n));
    }

    async obtenerNoLeidas (userId) {
        const notificaciones = await this.notificacionesRepository.getNoLeidas(userId);
        return notificaciones.map(n => this.toDTO(n));
    }

    async create(data) {
        const {destinatario, remitente, mensaje, fechaHoraCreacion} = data;

        if(!destinatario || !remitente || !mensaje || !fechaHoraCreacion) {
            //throw new ValidationError('')
        }

        const nueva = new Notificacion(destinatario, remitente, mensaje, fechaHoraCreacion);
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

    async delete(notificacionId) {
        const notificacion = await this.notificacionesRepository.findById(notificacionId);
        if (!notificacion) {
            //throw new NotFoundError("Notificacion no encontrada");
        }
        await this.notificacionesRepository.delete(notificacionId);
        return this.toDTO(notificacion);
    }
}