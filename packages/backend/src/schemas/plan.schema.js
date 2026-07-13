import mongoose from 'mongoose';
import { Plan } from '../domain/models/entities/planes/Plan.js';

const coberturaSchema = new mongoose.Schema({
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servicio'
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
        type: [coberturaSchema],
        default: []
    },
    coberturasPractica: {
        type: [coberturaSchema],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: 'planes'
});

planSchema.loadClass(Plan);

export const PlanModel = mongoose.model('Plan', planSchema);
