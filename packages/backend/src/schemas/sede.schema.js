import mongoose from "mongoose";

export const sedeSchema = new mongoose.Schema(
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
    { _id: false }
)