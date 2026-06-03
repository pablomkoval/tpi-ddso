import mongoose from "mongoose";
import { SolicitudCambioTurno } from "../domain/models/entities/turnos/SolicitudCambioTurno.js";
import { EstadoSolicitudCambioTurno } from "../domain/enum/EstadoSolicitudCambioTurno.js";

const solicitudCambioTurnoSchema = new mongoose.Schema(
  {
    turnoOriginal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turno",
      required: true,
    },
    turnoNuevo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turno",
      required: true,
    },
    solicitanteId: {
      type: String,
      required: true,
    },
    pacienteId: {
      type: String,
      required: true,
    },
    medicoId: {
      type: String,
      required: true,
    },
    confirmadorId: {
      type: String,
      default: null,
    },
    motivo: {
      type: String,
      default: null,
    },
    motivoRechazo: {
      type: String,
      default: null,
    },
    estado: {
      type: String,
      enum: Object.values(EstadoSolicitudCambioTurno),
      default: EstadoSolicitudCambioTurno.PENDIENTE,
    },
    fechaSolicitud: {
      type: Date,
      default: Date.now,
    },
    fechaResolucion: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "solicitudes_cambio_turno",
  },
);

solicitudCambioTurnoSchema.loadClass(SolicitudCambioTurno);

export const SolicitudCambioTurnoModel = mongoose.model(
  "SolicitudCambioTurno",
  solicitudCambioTurnoSchema,
);
