import mongoose from "mongoose";

const sedeSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        direccion: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        collection: 'sedes'
    }
)

export const SedeModel = mongoose.model('Sede', sedeSchema);