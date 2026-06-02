import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../shared/errors/AppError.js"
import { createServicioSchema } from "../validators/servicio.schema.zod.js";
import { validarEnteroPositivo } from "../utils/validarEnteroPositivo.js";

export class ServicioService {
    constructor(servicioRepository, servicioMedRepository) {
        this.servicioRepository = servicioRepository;
        this.servicioMedRepository = servicioMedRepository;
    }


    // Numero y limite, si no están 1 o 10 respectivamente. Sin paginacion, findAll normal
    async findAll({ numeroPagina = 1, limitePorPagina = 10/* , filtros = {}  */ } = {}) {
        this.validarPaginacion(numeroPagina, limitePorPagina)
        //this.validarFiltros(filtros)

        const { servicios, totalServicios } = await this.servicioRepository.findAllPaginated(
            numeroPagina,
            limitePorPagina/* ,
            filtros */
        )

        const totalPaginas = totalServicios === 0 ? 0 : Math.ceil(totalServicios / limitePorPagina)


        return {
            servicios,
            numeroPagina,
            limitePorPagina,
            totalPaginas,
            totalServicios
        }
    }

    async findById(id) {
        validarEnteroPositivo(id, "Id")

        const servicio = await this.servicioRepository.findById(id)

        if (!servicio) {
            throw new NotFoundError("Servicio no encontrado")
        }

        return servicio
    }

    async create(datosServicio) {
        this.validarDatosServicio(datosServicio)
        this.validarNombreDisponible(datosServicio.nombre)

        const servicioGuardado = await this.servicioRepository.save(datosServicio)

        return servicioGuardado
    }

    async createSeveral(listaDatosServicios) {
        if (!Array.isArray(listaDatosServicios) || listaDatosServicios.length === 0) {
            throw new BadRequestError("Debe enviar una lista de servicios no vacía")
        }

        listaDatosServicios.forEach((datos) => {
            this.validarDatosServicio(datos)
            this.validarNombreDisponible(datos.nombre)
        })
        const serviciosGuardados = await this.servicioRepository.saveAll(listaDatosServicios)
        return serviciosGuardados
    }

    async update(id, datosServicio) {
        this.validarDatosServicio(datosServicio)
        this.validarNombreDisponible(datosServicio.nombre, id)
        /* const servicioExistente = this.findById(id)
        

        const servicioActualizado = crearServicio(datosServicio)

        servicioActualizado.id = servicioExistente.id */
        const servicioActualizado = await this.servicioRepository.update(id, datosServicio)
        return servicioActualizado
    }

    async delete(id) {
        validarEnteroPositivo(id, "Id")
        const servicioABorrar = await this.servicioRepository.findById(id)

        if (!servicioABorrar) {
            throw new NotFoundError("Servicio no encontrado")
        }
        await this.servicioRepository.softDelete(id) //por default borrado logico

        return servicioABorrar
    }

    validarDatosServicio(datosServicio) {
        const resultado = createServicioSchema.safeParse(datosServicio)

        if (!resultado.success) {
            throw new UnprocessableEntityError(
                resultado.error.issues
                    .map(issue => issue.message)
                    .join(", ")
            )
        }

        return resultado.data
    }

    async validarNombreDisponible(nombre, idActual = null) {
        const servicioExistente = await this.servicioRepository.findByName(nombre)
        const existeServicioConMismoNombre = servicioExistente && servicioExistente.id !== idActual

        if (existeServicioConMismoNombre) {
            throw new ConflictError("Ya existe un servicio con el mismo nombre")
        }
    }

    /* validarFiltros({ precioMin, precioMax, categoria } = {}) {
        if (precioMin !== undefined && precioMin <= 0) {
            throw new BadRequestError("precioMin debe ser mayor a 0")
        }
        if (precioMax !== undefined && precioMax <= 0) {
            throw new BadRequestError("precioMax debe ser mayor a 0")
        }
        if (precioMin !== undefined && precioMax !== undefined && precioMin > precioMax) {
            throw new BadRequestError("precioMin no puede ser mayor que precioMax")
        }
        if (categoria !== undefined && (typeof categoria !== "string" || categoria.trim().length === 0)) {
            throw new BadRequestError("La categoría debe ser una cadena de texto no vacía")
        }
    } */

    validarPaginacion(numeroPagina, limitePorPagina) {
        validarEnteroPositivo(numeroPagina, "Numero de página")
        validarEnteroPositivo(limitePorPagina, "Límite por página")
    }

    ////////////////////// SERVICIOS MED ////////////////////////

    async findServicioMedById(idServicioMed, session = null) {
        //validarEnteroPositivo(idServicioMed, "Id")
        const servicioMed = await this.servicioMedRepository.findById(idServicioMed, session)
        if (!servicioMed) {
            throw new NotFoundError("Servicio no encontrado")
        }

        return servicioMed //no toTDO porque: 1. Otro formato, 2. Lo hace medicoService
    }

    async createServicioMed(datosServicioMed, session = null) {
        //this.validarDatosServicioMed(datosServicioMed)
        //buscar si el servicioUnico es existente, sino crearlo, caso practica ver que se hace con el codigo
        const servicioMedGuardado = await this.servicioMedRepository.save(datosServicioMed, session)
        return servicioMedGuardado
    }

    async deleteServicioMed(servicioMed, session = null) {
        return await this.servicioMedRepository.softDelete(servicioMed.id, session)
    }

    async updateServicioMed(idServicioMed, datosServicioMed, session = null) {
        return await this.servicioMedRepository.update(idServicioMed, datosServicioMed, session)
    }

    /* validarDatosServicioMed(datosServicioMed) { //deberia venir parseado desde medicoController 
        const resultado = createServicioMedSchema.safeParse(datosServicioMed)

        if (!resultado.success) {
            throw new UnprocessableEntityError(
                resultado.error.issues
                    .map(issue => issue.message)
                    .join(", ")
            )
        }

        return resultado.data
    }
 */

}
