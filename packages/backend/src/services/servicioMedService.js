import { crearServicio } from "../domain/factories/crearServicio.js";
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnprocessableEntityError
} from "../errors/AppError.js"
import { ServicioMedRepository } from "../repositories/servicioMedRepository.js";

export class ServicioMedService {
    constructor({ servicioMedRepository = new ServicioMedRepository() } = {}) {
        this.servicioMedRepository = servicioMedRepository;
    }


    toDTO(servicioMed) {
        return {
            id: servicioMed.id || servicioMed._id,
            nombre: servicioMed.nombre,
            costo: servicioMed.costo,
            duracionTurnoEnMins: servicioMed.duracionTurnoEnMins
        }
    }

    // Numero y limite, si no están 1 o 10 respectivamente y si se pasa undefined {}
    async findAll({ numeroPagina = 1, limitePorPagina = 10/* , filtros = {}  */ } = {}) {
        this.validarPaginacion(numeroPagina, limitePorPagina)
        //this.validarFiltros(filtros)

        const { servicioMeds, totalServicioMeds } = await this.servicioMedRepository.findAllPaginated(
            numeroPagina,
            limitePorPagina/* ,
            filtros */
        )
        const servicioMedsFormateados = servicioMeds.map(s => this.toDTO(s))
        const totalPaginas = totalServicioMeds === 0 ? 0 : Math.ceil(totalServicioMeds / limitePorPagina)

        return {
            servicioMedsFormateados,
            numeroPagina,
            limitePorPagina,
            totalPaginas,
            totalServicioMeds
        }
    }

    async findById(id) {
        this.validarEnteroPositivo(id, "Id")

        const servicioMed = await this.servicioMedRepository.findById(id)

        if (!servicioMed) {
            throw new NotFoundError("Servicio no encontrado")
        }

        return this.toDTO(servicioMed)
    }

    async create(datosServicioMed) {
        this.validarDatosServicioMed(datosServicioMed)
        this.validarNombreDisponible(datosServicioMed.nombre)

        const servicioMed = crearServicio(datosServicioMed)
        const servicioMedGuardado = await this.servicioMedRepository.save(servicioMed)

        return this.toDTO(servicioMedGuardado)
    }

    async createSeveral(listaServicioMeds) {
        if (!Array.isArray(listaServicioMeds) || listaServicioMeds.length === 0) {
            throw new BadRequestError("Debe enviar una lista de servicios no vacía")
        }

        const servicioMeds = listaServicioMeds.map((datos) => {
            this.validarDatosServicioMed(datos)
            this.validarNombreDisponible(datos.nombre)
            return crearServicio(datos)
        })

        const servicioMedsGuardados = await this.servicioMedRepository.saveAll(servicioMeds)

        return servicioMedsGuardados.map(s => this.toDTO(s))
    }

    async update(id, datosServicioMed) {
        this.validarEnteroPositivo(id, "Id")
        this.validarDatosServicioMed(datosServicioMed)
        this.validarNombreDisponible(datosServicioMed.nombre, id)
        /* const servicioMedExistente = this.findById(id)
        

        const servicioMedActualizado = crearServicio(datosServicioMed)

        servicioMedActualizado.id = servicioMedExistente.id */
        const servicioMedActualizado = await this.servicioMedRepository.update(id, datosServicioMed)
        return this.toDTO(servicioMedActualizado)
    }

    async delete(id) {
        this.validarEnteroPositivo(id, "Id")
        const servicioMedABorrar = await this.servicioMedRepository.findById(id)

        if (!servicioMedABorrar) {
            throw new NotFoundError("Servicio no encontrado")
        }
        await this.servicioMedRepository.softDelete(id) //por default borrado logico

        return this.toDTO(servicioMedABorrar)
    }

    validarDatosServicioMed(datosServicioMed) {
        if (!datosServicioMed || typeof datosServicioMed !== "object" || Array.isArray(datosServicioMed)) {
            throw new BadRequestError("Los datos del producto son inválidos")
        }

        const { nombre, duracionTurnoEnMins, costo, codigo, tipoServicio } = datosServicioMed

        if (typeof nombre !== "string" || nombre.trim().length < 3) {
            throw new UnprocessableEntityError("El nombre del producto debe tener al menos 3 caracteres") //arbitrario, no necesario
        }
        if (!Number.isFinite(duracionTurnoEnMins) || duracionTurnoEnMins <= 0) {
            throw new UnprocessableEntityError("La duración del turno debe ser mayor a 0")
        }

        if (!Number.isInteger(costo) || costo <= 0) {
            throw new UnprocessableEntityError("El costo debe ser un entero mayor a 0")
        }

        if (typeof tipoServicio !== "string" || (tipoServicio !== "practica" && tipoServicio !== "especialidad")) {
            throw new UnprocessableEntityError("El tipo de servicio debe ser práctica o especialidad")
        }

        if (codigo && (typeof codigo !== "string" || codigo.trim().length < 2)) { //arbitrario, no necesario
            throw new UnprocessableEntityError("El codigo debe tener al menos 2 caracteres")
        }
    }

    async validarNombreDisponible(nombre, idActual = null) {
        const servicioMedExistente = await this.servicioMedRepository.findByName(nombre)
        const existeServicioMedConMismoNombre = servicioMedExistente && servicioMedExistente.id !== idActual

        if (existeServicioMedConMismoNombre) {
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
        this.validarEnteroPositivo(numeroPagina, "Numero de página")
        this.validarEnteroPositivo(limitePorPagina, "Límite por página")
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new BadRequestError(`${parametro} debe ser un entero positivo`)
        }
    }

}