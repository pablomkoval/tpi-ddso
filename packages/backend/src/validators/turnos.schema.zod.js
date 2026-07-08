/* Hacer e implementar Schema de Zod validador */
import { z } from "zod"
//import { EstadoTurno } from "../domain/enum/EstadoTurno.js"
import { idMongoSchema } from "./id.schema.zod.js"

//para la busqueda de turnos del paciente
export const filtroBusqTurnoPaciente = z.object({

    servicioId: idMongoSchema, //servicios se intentan autocompletar en la busqueda
    medicoId: idMongoSchema.optional(), //medico se intentan autocompletar en la busqueda
    //turnos disponibles no tienen paciente asignado
    sedeId: idMongoSchema.optional(), //sede se intentan autocompletar en la busqueda

    fechaDesde: z.string().optional(),
    fechaHasta: z.string().optional(),
    sortBy: z
        .enum(["fechaHora", "costo"])
        .default("fechaHora"),

    sortOrder: z.coerce.number().refine(
        (val) => val === 1 || val === -1,
        {
            message: "sortOrder debe ser 1 o -1"
        }
    ).default(1)
})


export const filtroBusqTurnoMedico = z.object({
    /* pacienteId: z.string().optional(),*/ //plantear cual usar
    nombrePaciente: z.string().optional(), //plantear cual usar
    
    //turnos disponibles no tienen paciente asignado

    servicioId: idMongoSchema.optional(), //servicios se intentan autocompletar en la busqueda
    sedeId: idMongoSchema.optional(), //sede se intentan autocompletar en la busqueda

    fechaDesde: z.string().optional(),
    fechaHasta: z.string().optional()
})
