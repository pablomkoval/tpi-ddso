import mongoose from 'mongoose';
import { Plan } from '../domain/models/entities/planes/Plan.js';

const coberturaEspecialidadSchema = new mongoose.Schema({
    prestacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prestacion'
    },
    nivel: {
        type: String,
        enum: ['TOTAL', 'PARCIAL', 'NO_CUBIERTA'],
        required: true
    }
}, { _id: false });

const coberturaPracticaSchema = new mongoose.Schema({
    practica: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prestacion'
    },
    nivel: {
        type: String,
        enum: ['TOTAL', 'PARCIAL', 'NO_CUBIERTA'],
        required: true
    }
}, { _id: false });

const planSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    coberturasEspecialidad: {
        type: [coberturaEspecialidadSchema],
        default: []
    },
    coberturasPractica: {
        type: [coberturaPracticaSchema],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'planes'
});

planSchema.loadClass(Plan);

export const PlanModel = mongoose.model('Plan', planSchema);
