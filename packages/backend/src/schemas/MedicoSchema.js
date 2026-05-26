import mongoose from "mongoose";
import Medico from "../domain/models/entities/medico/Medico.js";
import { disponibilidadHorariaSchema } from "./DisponibilidadHorariaSchema.js";
import { sedeSchema } from "./SedeSchema.js";

const medicoSchema = new mongoose.Schema(
    {
        usuario: {
            type: String,
            required: true,
            trim: true
        },
        matricula: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        especialidades: {
            type: Array,
            default: []
        },
        practicas: {
            type: Array,
            default: []
        },
        sedes: {
            type: [sedeSchema],
            default: []
        },
        disponibilidades: {
            type: [disponibilidadHorariaSchema],
            default: []
        },
        turnos: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true,
    }
)

medicoSchema.loadClass(Medico);

export const MedicoModel = mongoose.model("Medico", medicoSchema);
