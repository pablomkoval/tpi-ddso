import { z } from "zod";
import { idMongoSchema } from "./id.schema.zod.js";


const disponibilidadSchema = z.object({
    diaSemana: z.string(),
    horaDesde: z.string(),
    horaHasta: z.string(),
    sede: idMongoSchema,
    prestacion: idMongoSchema

})


export const createMedicoSchema = z.object({
    usuario: z.string().min(1),

    matricula: z.string().min(1),

    nombre: z.string().min(1),

    especialidades: z.array(idMongoSchema)
        .default([]),

    practicas: z.array(idMongoSchema)
        .default([]),

    sedes: z.array(idMongoSchema)
        .default([]),

    disponibilidades: z.array(disponibilidadSchema)
        .default([])
});

export const patchMedicoSchema = createMedicoSchema
    .pick({
        nombre: true,
        sedes: true
    })
    .partial()
    .strict()
    .refine(
        data => Object.keys(data).length > 0,
        {
            message: "Se debe enviar al menos un campo a actualizar."
        }
    )