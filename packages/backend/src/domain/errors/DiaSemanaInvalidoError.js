import AppError from "../../shared/errors/AppError.js";

export class DiaSemanaInvalidoError extends AppError {
    constructor(mensaje = "El día de semana no es válido") {
        super(mensaje, 400, "DIA_SEMANA_INVALIDO");
        this.name = "DiaSemanaInvalidoError";
    }
}
