import { AppError } from "../../shared/errors/AppError.js";

export class HorarioInvalidoError extends AppError {
    constructor(mensaje = "El horario no tiene un formato válido") {
        super(mensaje, 400, "HORARIO_INVALIDO");
        this.name = "HorarioInvalidoError";
    }
}
