import mongoose from 'mongoose';

const servicioMedSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    duracionTurnoEnMins: {
        type: Number,
        required: true,
        min: 0
    },
    costo: {
        type: Number,
        required: true,
        min: 0
    },
    //Borrado logico
    eliminado: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    versionKey: false,
    discriminatorKey: "tipoServicio",
    collection: 'servicios'
},

);



//servicioMedSchema.loadClass(ServicioMed); no existe una clase padre "servicio", quiza a futuro


export const ServicioMedModel = mongoose.model('Servicio', servicioMedSchema);