import mongoose from 'mongoose';

const servicioUnicoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    //Borrado logico
    tipoServicio: {
        type: String,
        required: true,
        enum: ["practica", "especialidad"]
    },
    eliminado: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    versionKey: false,
    collection: 'servicios'
},

);

export const ServicioModel = mongoose.model('Servicio', servicioUnicoSchema);
