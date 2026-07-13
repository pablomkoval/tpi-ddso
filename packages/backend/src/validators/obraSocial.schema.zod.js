import { z } from "zod";
import { idMongoSchema } from "./id.schema.zod.js";
import { NivelCobertura } from "../domain/enum/NivelCobertura.js"

export const obraSocialSchema = z.object({
    nombre: z.string()
})


const coberturaSchema = z.object({
    servicio: idMongoSchema,
    nivel: z.nativeEnum(NivelCobertura)
});

export const createPlanSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio"),

    coberturasEspecialidad: z
        .array(coberturaSchema)
        .default([]),

    coberturasPractica: z
        .array(coberturaSchema)
        .default([])
});
