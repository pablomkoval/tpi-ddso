import { NotFoundError } from '../shared/errors/AppError.js';
import { ValidationError } from '../shared/errors/AppError.js';
import { Notificacion } from '../domain/models/entities/turnos/Notificacion.js'

export class NotificacionesService {
    constructor(notificacionesRepository) {
        this.notificacionesRepository = notificacionesRepository;
    }


    async obtenerLeidas(userId, page, limit) {
        return this.findAllPaginated(
            page,
            limit,
            {
                destinatario: userId,
                leida: true
            }
        );
    }

    async obtenerNoLeidas(userId, page, limit) {
        return this.findAllPaginated(
            page,
            limit,
            {
                destinatario: userId,
                leida: false
            }
        );
    }

    async create(data) {
        const { destinatario, remitente, mensaje } = data;

        if (!destinatario || !remitente || !mensaje) {
            throw new ValidationError("Los datos para la notificacion no son validos");
        }

        const nueva = new Notificacion(destinatario, remitente, mensaje);
        const notificacionGuardada = await this.notificacionesRepository.save(nueva);

        return notificacionGuardada;
    }

    async crearSegunEstadoTurno(turno) {
        const notificacion = Notificacion.crearSegunEstadoTurno(turno);
        return await this.notificacionesRepository.save(notificacion);
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

    async findAllPaginated(page, limit, criterios = {}) {
        return await this.notificacionesRepository.findAllPaginated(criterios, page, limit);
    }

    async count(criterios = {}) {
        return await this.notificacionesRepository.count(criterios);
    }

    async obtenerResumen(userId) {
        const total = await this.notificacionesRepository.count({
            destinatario: userId
        });

        const leidas = await this.notificacionesRepository.count({
            destinatario: userId,
            leida: true
        });

        const noLeidas = await this.notificacionesRepository.count({
            destinatario: userId,
            leida: false
        });

        return {
            total,
            leidas,
            noLeidas
        };
    }

    async marcarTodasComoLeidas(userId) {
        return await this.notificacionesRepository.marcarTodasComoLeidas({
            destinatario: userId
        });
    }
}
