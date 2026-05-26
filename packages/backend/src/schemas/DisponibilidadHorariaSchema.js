import mongoose from "mongoose";
import { sedeSchema } from "./SedeSchema.js";

export const disponibilidadHorariaSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: false
        },
        diaSemana: {
            type: String,
            required: true,
            trim: true
        },
        horaDesde: {
            type: String,
            required: true
        },
        horaHasta: {
            type: String,
            required: true
        },
        sede: {
            type: sedeSchema,
            required: true
        }
    },
    { _id: false }
)