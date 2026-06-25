import { z } from "zod"
import { idMongoSchema } from "./id.schema.zod.js"

const baseSchema = {
    servicioUnico: idMongoSchema,

    costo: z
        .number()
        .nonnegative(),

    duracionTurnoEnMins: z
        .number()
        .int()
        .positive()
}

export const createPrestacionSchema =
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