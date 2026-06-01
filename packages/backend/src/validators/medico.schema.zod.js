import { z } from "zod";
import { createIdMongoSchema } from "./id.schema.zod.js";

const sedeSchema = z.object({
    id: z.string(),
    nombre: z.string().min(1),
    direccion: z.string().min(1)
});

export const createMedicoSchema = z.object({
    usuario: z.string().min(1),

    matricula: z.string().min(1),

    nombre: z.string().min(1),

    especialidades: z.array(createIdMongoSchema)
        .default([]),

    practicas: z.array(createIdMongoSchema)
        .default([]),

    sedes: z.array(sedeSchema)
        .default([])
});