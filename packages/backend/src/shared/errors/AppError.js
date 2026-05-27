export default class AppError extends Error {
    constructor(mensaje, statusCode = 500, codigo = "ERROR_INTERNO") {
        super(mensaje);
        this.name = "AppError";
        this.statusCode = statusCode; // Para mapear a códigos HTTP
        this.codigo = codigo; // Código de error interno para el cliente
    }
}

export class BadRequestError extends AppError {
    constructor(message, codigo = "SOLICITUD_INCORRECTA") {
        super(message, 400, codigo);
    }
}

export class NotFoundError extends AppError {
    constructor(message, codigo = "RECURSO_NO_ENCONTRADO") {
        super(message, 404, codigo);
    }
}

export class ConflictError extends AppError {
    constructor(message, codigo = "CONFLICTO") {
        super(message, 409, codigo);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message, codigo = "ENTIDAD_IMPROCESABLE") {
        super(message, 422, codigo);
    }
}