import mongoose from 'mongoose';
import { Notificacion } from '../domain/models/entities/turnos/Notificacion.js';

const notificacionSchema = new mongoose.Schema({
    destinatario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
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
    },
    eliminado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'notificaciones'
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);