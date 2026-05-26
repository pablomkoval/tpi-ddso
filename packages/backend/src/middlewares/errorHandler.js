import { AppError } from '../shared/errors/AppError.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            codigo: err.codigo,
            message: err.message
        });
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 'error',
            codigo: 'VALIDATION_ERROR',
            message: messages.join(', ')
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 'error',
            codigo: 'INVALID_ID',
            message: `ID inválido: ${err.value}`
        });
    }

    console.error('Error no controlado:', err);
    res.status(500).json({
        status: 'error',
        codigo: 'ERROR_INTERNO',
        message: 'Error interno del servidor'
    });
};

export default errorHandler;
