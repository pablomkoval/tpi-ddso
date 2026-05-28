import mongoose from "mongoose";

export const servicioMedicoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: false
        },
        codigo: {
            type: String,
            required: true,
            trim: true
        }
    },
    { _id: false }
)