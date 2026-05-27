import { z } from "zod"

export const servicioSchema = z.object({
    nombre: z
        .string({
            invalid_type_error: "El nombre del producto debe ser un string"
        })
        .trim()
        .min(3), //arbitrario tamanio minimo de nombre

    tipoServicio: z.enum([
        "practica",
        "especialidad"
    ],
        {
            errorMap: () => ({
                message: "El tipo de servicio debe ser práctica o especialidad"
            })
        }
    )
}).strict()