import mongoose from "mongoose";
import Turno from "../domain/models/entities/turnos/Turno.js";

const turnoSchema = new mongoose.Schema(
    {   
        paciente: {
            type: String, // Referencia al ID del paciente
            default: null
        },
        medico: {
            type: mongoose.Types.ObjectId,
            ref: "Medico",
            required: true
        },
        fechaHora: {
            type: Date,
            required: true
        },
        sede: {
            type: mongoose.Types.ObjectId,
            ref: "Sede"
        },
        servicio: {
            type: mongoose.Types.ObjectId,
            ref: "ServicioMedico",
            required: true
        },
        costo: {
            type: Number,
            default: 0
        },
        estado: {
            type: String,
            enum: ["DISPONIBLE", "RESERVADO", "CANCELADO", "COMPLETADO"],
            default: "DISPONIBLE"
        },
        historialEstados: [
            {
                estado: String,
                fechaHoraCambio: Date,
                usuario: String,
                motivoCambio: String
            }
        ], 
    },
    {
        timestamps: true,
        id: true
    }
)

turnoSchema.loadClass(Turno);

export const TurnoModel = mongoose.model("Turno", turnoSchema);
