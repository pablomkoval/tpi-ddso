import mongoose from 'mongoose';
import { Paciente } from "../domain/models/entities/paciente/Paciente.js";

const pacienteSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    obraSocial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ObraSocial',
        default: null
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'pacientes'
});

pacienteSchema.loadClass(Paciente);

export const PacienteModel = mongoose.model('Paciente', pacienteSchema);