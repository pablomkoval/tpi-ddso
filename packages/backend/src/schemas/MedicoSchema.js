import mongoose from "mongoose";
import Medico from "../domain/models/entities/medico/Medico.js";

const medicoSchema = new mongoose.Schema(
    {
        // Campos
    },
    {
        // Opciones del schema
    }
)

medicoSchema.loadClass(Medico);

export const MedicoModel = mongoose.model("Medico", medicoSchema);
