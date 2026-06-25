import { validarEnteroPositivo } from "./validarEnteroPositivo.js"

const PAGE_SIZE = 1;
const PAGE_LIMIT = 10;

export function extraerPaginacion(query) {
        const numeroPagina = query?.page === undefined ? PAGE_SIZE : Number(query.page)
        const limitePorPagina = query?.limit === undefined ? PAGE_LIMIT : Number(query.limit)

        validarEnteroPositivo(numeroPagina, "page")
        validarEnteroPositivo(limitePorPagina, "limit")

        return { numeroPagina, limitePorPagina }
    }