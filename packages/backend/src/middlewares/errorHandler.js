import AppError from "../shared/errors/AppError.js"

export function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            codigo: err.codigo,
            timestamp: err.timestamp,
        })
    }

    return res.status(500).json({
        status: 500,
        message: "Error interno del servidor",
        codigo: "ERROR_INTERNO",
        timestamp: new Date().toISOString(),
    })
}