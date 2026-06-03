import AppError from "../../shared/errors/AppError.js";

export class ServicioNoPrestadoError extends AppError {
    constructor(mensaje = "El médico no presta el servicio solicitado") {
        super(mensaje, 400, "SERVICIO_NO_PRESTADO");
        this.name = "ServicioNoPrestadoError";
    }
}