import { z } from "zod"
import { createIdMongoSchema } from "./id.schema.zod.js"

const baseSchema = {
    servicioUnico: createIdMongoSchema,

    costo: z
        .number()
        .nonnegative(),

    duracionTurnoEnMins: z
        .number()
        .int()
        .positive()
}

export const createServicioMedSchema =
    z.discriminatedUnion("tipoServicio", [

        z.object({
            ...baseSchema,

            tipoServicio: z.literal("practica"),

            codigo: z
                .string()
                .trim()
                .min(1)

        }).strict(),

        z.object({
            ...baseSchema,

            tipoServicio: z.literal("especialidad")

        }).strict()
    ])