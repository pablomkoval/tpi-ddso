import mongoose from "mongoose";

const sedeSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true
        },
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