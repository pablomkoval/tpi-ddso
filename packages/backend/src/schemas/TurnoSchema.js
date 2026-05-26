import mongoose from "mongoose";
import Turno from "../domain/models/entities/turnos/Turno.js";

const turnoSchema = new mongoose.Schema(
    {
        // Campos
    },
    {
        // Opciones del schema
    }
)

turnoSchema.loadClass(Turno);

export const TurnoModel = mongoose.model("Turno", turnoSchema);
