import mongoose from "mongoose";
import Medico from "../domain/models/entities/medico/Medico.js";
import { disponibilidadHorariaSchema } from "./disponibilidadHoraria.schema.js";
import { sedeSchema } from "./sede.schema.js";

const medicoSchema = new mongoose.Schema(
    {
        /* usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            required: true,
        }, */ // Así es como debería ir
        usuario: {
            type: String, // Referencia al ID del usuario
            required: true
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
        especialidades: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prestacion',
            default: []
        }],

        practicas: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prestacion',
            default: []
        }],
        sedes: {
            type: [sedeSchema],
            default: []
        },
        disponibilidades: {
            type: [disponibilidadHorariaSchema],
            default: []
        },
        turnos: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Turno"
            }],
            default: []
        }
    },
    {
        timestamps: true,
    }
)

medicoSchema.loadClass(Medico);

export const MedicoModel = mongoose.model("Medico", medicoSchema);
