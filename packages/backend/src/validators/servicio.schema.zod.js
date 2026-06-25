import { z } from "zod"
import { TipoServicio } from "../domain/enum/TipoServicio.js"

export const createServicioSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(3), //arbitrario tamanio minimo de nombre

    tipoServicio: z.nativeEnum(TipoServicio,
        {
            errorMap: () => ({
                message: "El tipo de servicio debe ser práctica o especialidad"
            })
        }
    )
}).strict()