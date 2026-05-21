import { AppError } from "../../shared/errors/AppError.js";

export class SedeNoAutorizadaError extends AppError {
    constructor(mensaje = "La sede no está autorizada para este médico") {
        super(mensaje, 400, "SEDE_NO_AUTORIZADA");
        this.name = "SedeNoAutorizadaError";
    }
}

