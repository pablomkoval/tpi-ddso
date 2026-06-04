import { z } from "zod";
import { createIdMongoSchema } from "./id.schema.zod.js";


const disponibilidadSchema = z.object({
    diaSemana: z.string(),
    horaDesde: z.string(),
    horaHasta: z.string(),
    sede: createIdMongoSchema,
    prestacion: createIdMongoSchema

})


export const createMedicoSchema = z.object({
    usuario: z.string().min(1),

    matricula: z.string().min(1),

    nombre: z.string().min(1),

    especialidades: z.array(createIdMongoSchema)
        .default([]),

    practicas: z.array(createIdMongoSchema)
        .default([]),

    sedes: z.array(createIdMongoSchema)
        .default([]),

    disponibilidades: z.array(disponibilidadSchema)
        .default([])
});