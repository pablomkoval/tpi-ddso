import { AppError } from "../../shared/errors/AppError.js";

export class RangoHorarioInvalidoError extends AppError {
    constructor(mensaje = "La hora de inicio debe ser anterior a la hora de fin") {
        super(mensaje, 400, "RANGO_HORARIO_INVALIDO");
        this.name = "RangoHorarioInvalidoError";
    }
}
