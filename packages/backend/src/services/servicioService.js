import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../shared/errors/AppError.js"
import { ServicioRepository } from "../domain/models/repositories/servicioRepository.js";
import { ServicioMedRepository } from "../domain/models/repositories/servicioMedRepository.js";
import { servicioSchema } from "../validators/servicio.schema.js";
import { validarEnteroPositivo } from "../utils/validarEnteroPositivo.js";

class ServicioService {
    constructor({
        servicioRepository = new ServicioRepository(),
        servicioMedRepository = new ServicioMedRepository() } = {}) {
        this.servicioRepository = servicioRepository;
        this.servicioMedRepository = servicioMedRepository;
    }


    toDTO(servicio) {
        return {
            id: servicio.id || servicio._id,
            nombre: servicio.nombre,
            tipoServicio: servicio.tipoServicio //puede no ser necesario dependiendo de los Endpoints
        }
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

        const serviciosFormateados = servicios.map(s => this.toDTO(s))

        return {
            serviciosFormateados,
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

        return this.toDTO(servicio)
    }

    async create(datosServicio) {
        this.validarDatosServicio(datosServicio)
        this.validarNombreDisponible(datosServicio.nombre)

        const servicioGuardado = await this.servicioRepository.save(datosServicio)

        return this.toDTO(servicioGuardado)
    }

    async createSeveral(listaDatosServicios) {
        if (!Array.isArray(listaDatosServicios) || listaDatosServicios.length === 0) {
            throw new BadRequestError("Debe enviar una lista de servicios no vacía")
        }

        listaDatosServicios.forEach((datos) => {
            this.validarDatosServicio(datos)
            this.validarNombreDisponible(datos.nombre)
        })
        console.error("llegue bien antes del repo")
        const serviciosGuardados = await this.servicioRepository.saveAll(listaDatosServicios)
        console.error("sobrevivi el repo")
        return serviciosGuardados.map(s => this.toDTO(s))
    }

    async update(id, datosServicio) {
        validarEnteroPositivo(id, "Id")
        this.validarDatosServicio(datosServicio)
        this.validarNombreDisponible(datosServicio.nombre, id)
        /* const servicioExistente = this.findById(id)
        

        const servicioActualizado = crearServicio(datosServicio)

        servicioActualizado.id = servicioExistente.id */
        const servicioActualizado = await this.servicioRepository.update(id, datosServicio)
        return this.toDTO(servicioActualizado)
    }

    async delete(id) {
        validarEnteroPositivo(id, "Id")
        const servicioABorrar = await this.servicioRepository.findById(id)

        if (!servicioABorrar) {
            throw new NotFoundError("Servicio no encontrado")
        }
        await this.servicioRepository.softDelete(id) //por default borrado logico

        return this.toDTO(servicioABorrar)
    }

    validarDatosServicio(datosServicio) {
        const resultado = servicioSchema.safeParse(datosServicio)

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
        validarEnteroPositivo(idServicioMed, "Id")

        const servicioMed = await this.servicioMedRepository.findById(idServicioMed, session)

        if (!servicioMed) {
            throw new NotFoundError("Servicio no encontrado")
        }

        return servicioMed //no toTDO porque: 1. Otro formato, 2. Lo hace medicoService
    }

    async createServicioMed(datosServicioMed, session = null) {
        //this.validarDatosServicioMed(datosServicioMed)

        const servicioMedGuardado = await this.servicioMedRepository.save(datosServicioMed, session)

        return servicioMedGuardado
    }

    async deleteServicioMed(servicioMed, session = null) {
        await this.servicioMedRepository.softDelete(servicioMed.id, session)
    }

    async updateServicioMed(idServicioMed, datosServicioMed, session = null) {
        return await this.servicioMedRepository.update(idServicioMed, datosServicioMed, session)
    }

    /* validarDatosServicioMed(datosServicioMed) { //deberia venir parseado desde medicoController 
        const resultado = servicioMedSchema.safeParse(datosServicioMed)

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

export const servicioService = new ServicioService()
// exporto como singleton por ser usado en serviciosController y medicoService