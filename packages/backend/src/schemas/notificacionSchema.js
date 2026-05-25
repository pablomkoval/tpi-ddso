import mongoose from 'mongoose';
import { Notificacion } from '../models/entities/turnos/Notificacion.js';

const notificacionSchema = new mongoose.Schema({
    destinatarioId: {
        type: String,
        required: true
    },
    /*
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    } 
    */
    remitenteId: {
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    leida: {
        type: Boolean,
        default: false
    },
    fechaHoraCreacion: {
        type: Date,
        default: Date.now
    },
    fechaHoraLeida: {
        type: Date,
        default: null
    }
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);