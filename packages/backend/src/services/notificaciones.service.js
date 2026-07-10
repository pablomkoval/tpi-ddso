import { NotFoundError } from '../shared/errors/AppError.js';
import { ValidationError } from '../shared/errors/AppError.js';
import { Notificacion } from '../domain/models/entities/turnos/Notificacion.js'
import { UsuarioModel } from '../schemas/usuario.schema.js';
import { PacienteModel } from '../schemas/paciente.schema.js';
import { MedicoModel } from '../schemas/medico.schema.js';
import mongoose from 'mongoose';

export class NotificacionesService {
    constructor(notificacionesRepository) {
        this.notificacionesRepository = notificacionesRepository;
    }

    async resolverUsuarioId(id) {
        if (!id) return null;

        try {
            // Extraer el _id si es un documento Mongoose populado (ej: turno.medico)
            // Pero también revisar si tiene campo `usuario` directamente (Medico / Paciente populado)
            if (typeof id === 'object' && id !== null) {
                // Si el objeto ya tiene campo `usuario` (es un doc de Medico o Paciente populado)
                if (id.usuario) {
                    const usuarioId = String(id.usuario._id || id.usuario);
                    if (usuarioId && usuarioId !== '[object Object]') {
                        return usuarioId;
                    }
                }
                // Si no, extraer el _id del objeto
                const rawId = id._id || id.id;
                if (!rawId) return null;
                id = rawId;
            }

            const idStr = String(id);

            if (!idStr || idStr === '[object Object]') return null;

            // Si no hay conexión de Mongoose (tests unitarios), devolver el id tal cual
            if (mongoose.connection.readyState === 0) {
                return idStr;
            }

            // Evitar CastError para IDs no válidos (ej: 'SYSTEM')
            if (!mongoose.Types.ObjectId.isValid(idStr)) {
                return idStr;
            }

            // 1. ¿Es un UsuarioModel directamente?
            const usuario = await UsuarioModel.findById(idStr);
            if (usuario) {
                return usuario._id.toString();
            }

            // 2. ¿Es un PacienteModel? → devolver su usuario
            const paciente = await PacienteModel.findById(idStr);
            if (paciente && paciente.usuario) {
                return String(paciente.usuario);
            }

            // 3. ¿Es un MedicoModel? → devolver su usuario
            const medico = await MedicoModel.findById(idStr);
            if (medico && medico.usuario) {
                return String(medico.usuario);
            }

            // Si no se encontró en ninguna colección, usar el id tal cual
            return idStr;
        } catch (err) {
            console.error('[NotificacionesService] Error en resolverUsuarioId:', err.message);
            return null;
        }
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
        const { destinatario, remitente, mensaje, tipo = "INFO", referenciaId = null } = data;

        if (!mensaje) {
            throw new ValidationError("El mensaje de la notificacion es requerido");
        }

        const resolvedDestinatario = await this.resolverUsuarioId(destinatario);
        const resolvedRemitente = await this.resolverUsuarioId(remitente);

        if (!resolvedDestinatario) {
            console.warn('[NotificacionesService] No se pudo resolver el destinatario:', destinatario);
            throw new ValidationError("No se pudo resolver el destinatario de la notificacion");
        }
        if (!resolvedRemitente) {
            console.warn('[NotificacionesService] No se pudo resolver el remitente:', remitente);
            throw new ValidationError("No se pudo resolver el remitente de la notificacion");
        }

        const nueva = new Notificacion(resolvedDestinatario, resolvedRemitente, mensaje, tipo, referenciaId);
        const notificacionGuardada = await this.notificacionesRepository.save(nueva);

        return notificacionGuardada;
    }

    async crearSegunEstadoTurno(turno) {
        const data = Notificacion.datosSegunEstadoTurno(turno);
        return await this.create(data);
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
