import mongoose from 'mongoose';
import { Usuario } from '../domain/models/entities/Usuario.js';

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    keycloakId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collections: 'usuarios'
});

usuarioSchema.loadClass(Usuario);

export const UsuarioModel = mongoose.model('Usuario', usuarioSchema);