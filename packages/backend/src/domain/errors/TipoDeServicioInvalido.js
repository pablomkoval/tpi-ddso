import { AppError } from "../../shared/errors/AppError.js";

export class TipoDeServicioInvalido extends AppError {
    constructor(mensaje = "Tipo de servicio no válido") {
        super(mensaje, 400, "TIPO_SERVICIO_INVALIDO");
        this.name = "TipoDeServicioInvalidoError";
    }
}