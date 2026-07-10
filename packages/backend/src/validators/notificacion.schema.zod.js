import { z } from "zod";
import { idMongoSchema } from "./id.schema.zod.js";

export const createNotificacionSchema = z.object({
    destinatario: idMongoSchema,
    remitente: idMongoSchema,
    mensaje: z.string().trim().min(1, "El mensaje es obligatorio"),
    leida: z.boolean().optional().default(false),
    tipo: z.string().optional().default("INFO"),
    referenciaId: z.string().nullable().optional().default(null)
});