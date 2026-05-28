import { z } from "zod";

export const createNotificacionSchema = z.object({
    destinatario: z.string().trim().length(24, "El ID debe tener 24 caracteres"),
    remitente: z.string().trim().length(24, "El ID debe tener 24 caracteres"),
    mensaje: z.string().trim().min(1, "El mensaje es obligatorio"),
    leida: z.boolean().optional().default(false)
});