export default class AppError extends Error {
    constructor(mensaje, statusCode = 500, codigo = "ERROR_INTERNO") {
        super(mensaje);
        this.name = "AppError";
        this.statusCode = statusCode; // Para mapear a códigos HTTP
        this.codigo = codigo; // Código de error interno para el cliente
    }
}
