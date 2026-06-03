import mongoose from "mongoose";
import { sedeSchema } from "./sede.schema.js";

export const disponibilidadHorariaSchema = new mongoose.Schema(
    {
        /* id: {
            type: String,
            required: true,
            unique: false
        }, */
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
        },
        prestacion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prestacion',
            required: true
        }
    },
    {
        _id: true
    }
)