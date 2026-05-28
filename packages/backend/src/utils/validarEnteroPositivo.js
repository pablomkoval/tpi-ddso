import { BadRequestError } from "../shared/errors/AppError.js"

export function validarEnteroPositivo(numero, parametro) {
    if (!Number.isInteger(numero) || numero <= 0) {
        throw new BadRequestError(`El parámetro ${parametro} debe ser un entero positivo`)
    }
}