import { z } from "zod";

export const registerSchema = z.object({

    role: z.enum(["paciente", "medico"]),

    username: z.string()
        .min(3),

    password: z.string()
        .min(4),

    nombre: z.string()
        .min(2),

    // opcionales porque dependen del rol
    dni: z.string().optional(),

    obraSocial: z.string().optional(),

    plan: z.string().optional(),

    matricula: z.string().optional()
})
.superRefine((data, ctx) => {

    if (data.role === "paciente") {

        if (!data.dni) {
            ctx.addIssue({
                code: "custom",
                message: "dni es requerido"
            });
        }

        if (!data.obraSocial) {
            ctx.addIssue({
                code: "custom",
                message: "obraSocial es requerida"
            });
        }

        if (!data.plan) {
            ctx.addIssue({
                code: "custom",
                message: "plan es requerido"
            });
        }
    }

    if (data.role === "medico") {

        if (!data.matricula) {
            ctx.addIssue({
                code: "custom",
                message: "matricula es requerida"
            });
        }
    }
});