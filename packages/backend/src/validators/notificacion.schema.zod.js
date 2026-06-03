import { z } from "zod";
import { createIdMongoSchema } from "./id.schema.zod.js";

export const createNotificacionSchema = z.object({
    destinatario: createIdMongoSchema,
    remitente: createIdMongoSchema,
    mensaje: z.string().trim().min(1, "El mensaje es obligatorio"),
    leida: z.boolean().optional().default(false)
});