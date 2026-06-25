import { idMongoSchema } from "../validators/id.schema.zod.js"
import { BadRequestError } from "../shared/errors/AppError.js"

export function parsearId(id) {
        const resultado = idMongoSchema.safeParse(id)
        if (!resultado.success) {
                throw new BadRequestError(
                        resultado.error.issues.map(i => i.message).join(", ")
                )
        }
        return resultado.data
}