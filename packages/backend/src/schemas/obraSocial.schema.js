import mongoose from 'mongoose';
import { ObraSocial } from '../domain/models/entities/planes/ObraSocial.js';

const obraSocialSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    planes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        default: []
    }]
}, {
    timestamps: true,
    versionKey: false,
    collection: 'obras_sociales'
});

obraSocialSchema.loadClass(ObraSocial);


export const ObraSocialModel = mongoose.model('ObraSocial', obraSocialSchema);