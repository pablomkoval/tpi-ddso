import { validarEnteroPositivo } from "./validarEnteroPositivo.js";

export function validarPaginacion(numeroPagina, limitePorPagina) {
        validarEnteroPositivo(numeroPagina, "Numero de página")
        validarEnteroPositivo(limitePorPagina, "Límite por página")
    }
