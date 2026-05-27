import { z } from "zod"

const baseSchema = {
    servicioUnico: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Id inválido"), //formato de un id mongo

    costo: z
        .number()
        .nonnegative(),

    duracionTurnoEnMins: z
        .number()
        .int()
        .positive()
}

export const servicioMedSchema =
    z.discriminatedUnion("tipoServicioMed", [

        z.object({
            ...baseSchema,

            tipoServicioMed: z.literal("practica"),

            codigo: z
                .string()
                .trim()
                .min(1)

        }).strict(),

        z.object({
            ...baseSchema,

            tipoServicioMed: z.literal("especialidad")

        }).strict()
    ])