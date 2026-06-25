import { z } from "zod";
import { idMongoSchema } from "./id.schema.zod.js";

export const createSolicitudCambioTurnoSchema = z
  .object({
    turnoId: idMongoSchema,
    nuevoTurnoId: idMongoSchema,
    solicitanteId: z.string().trim().min(1, "El solicitante es obligatorio"),
    motivo: z.string().trim().min(1).optional(),
  })
  .strict();

export const confirmarSolicitudCambioTurnoSchema = z
  .object({
    confirmadorId: z.string().trim().min(1, "El confirmador es obligatorio"),
  })
  .strict();

export const rechazarSolicitudCambioTurnoSchema = z
  .object({
    confirmadorId: z.string().trim().min(1, "El confirmador es obligatorio"),
    motivoRechazo: z.string().trim().min(1).optional(),
  })
  .strict();
