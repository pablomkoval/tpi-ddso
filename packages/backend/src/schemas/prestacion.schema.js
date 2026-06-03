import mongoose from 'mongoose';

const prestacionSchema = new mongoose.Schema({
    servicioUnico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servicio',
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
    collection: 'prestaciones'
},

);



//prestacionSchema.loadClass(Prestacion); no existe una clase padre "servicio", quiza a futuro


export const PrestacionModel = mongoose.model('Prestacion', prestacionSchema);