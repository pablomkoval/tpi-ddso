import {
    BadRequestError,
} from "../errors/AppError.js"
import { ServicioMedService } from "../services/servicioMedService.js";

export class ServiciosMedController {
    constructor({ servicioMedService = new ServicioMedService() } = {}) {
        this.servicioMedService = servicioMedService;
    }


    findAll = async (req, res, next) => { //listar todos los servicios, un médico solo realmente no buscaria todos los servicios de otros médicos
        try {
            const paginacion = this.extraerPaginacion(req.query)
            //const filtros = this.extraerFiltros(req.query)
            const resultado = await this.servicioMedService.findAll({ ...paginacion/* , filtros */ })

            return res.status(200).json({
                status: "success",
                data: resultado.sevicioMeds,
                paginacion: {
                    numeroPagina: resultado.numeroPagina,
                    limitePorPagina: resultado.limitePorPagina,
                    totalPaginas: resultado.totalPaginas,
                    totalServicioMeds: resultado.totalServicioMeds
                }
            })
        } catch (error) {
            return next(error)
        }
    }

    create = async (req, res, next) => {
        try {
            const datosServicioMed = this.extraerYValidarBodyServicioMed(req.body)
            const servicioMedCreado = await this.servicioMedService.create(datosServicioMed)

            return res.status(201).json({ status: "success", data: servicioMedCreado })
        } catch (error) {
            return next(error)
        }
    }

    findById = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const servicioMed = await this.servicioMedService.findById(id)

            return res.status(200).json({ status: "success", data: servicioMed })
        } catch (error) {
            return next(error)
        }
    }

    update = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const datosServicioMed = this.extraerYValidarBodyServicioMed(req.body)
            const servicioMedActualizado = await this.servicioMedService.update(id, datosServicioMed)

            return res.status(200).json({ status: "success", data: servicioMedActualizado })
        } catch (error) {
            return next(error)
        }
    }

    seed = async (req, res, next) => { //datos hardcodeados
        const SERVICIOS_INICIALES = [
            { nombre: "Consulta Pediátrica", duracionTurnoEnMins: 40, costo: 18000, tipoServicio: "especialidad" },
            { nombre: "Control Cardiológico", duracionTurnoEnMins: 45, costo: 25000, tipoServicio: "especialidad" },
            { nombre: "Consulta Dermatológica", duracionTurnoEnMins: 30, costo: 22000, tipoServicio: "especialidad" },
            { nombre: "Consulta Endocrinológica", duracionTurnoEnMins: 45, costo: 26000, tipoServicio: "especialidad" },
            { nombre: "Vacunación", duracionTurnoEnMins: 10, costo: 8000, codigo: "VAC", tipoServicio: "practica" },
            { nombre: "Tomografía Computada", duracionTurnoEnMins: 40, costo: 45000, codigo: "TAC", tipoServicio: "practica" },
            { nombre: "Resonancia Magnética", duracionTurnoEnMins: 60, costo: 70000, codigo: "RM", tipoServicio: "practica" },
            { nombre: "Consulta Oncológica", duracionTurnoEnMins: 60, costo: 35000, tipoServicio: "especialidad" }
        ]

        try {
            const listaServicioMeds = Array.isArray(req.body) && req.body.length > 0 ? req.body : SERVICIOS_INICIALES
            const servicioMedsCreados = await this.servicioMedService.createSeveral(listaServicioMeds)

            return res.status(201).json({ status: "success", data: servicioMedsCreados })
        } catch (error) {
            return next(error)
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = this.parsearId(req.params.id)
            const servicioMedEliminado = await this.servicioMedService.delete(id)

            return res.status(200).json({ status: "success", data: servicioMedEliminado })
        } catch (error) {
            return next(error)
        }
    }

    parsearId(idParam) {
        const id = Number(idParam)

        this.validarEnteroPositivo(id, "id")

        return id
    }

    extraerYValidarBodyServicioMed(body) {
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            throw new BadRequestError("El cuerpo de la request es inválido")
        }

        const camposPermitidos = ["nombre", "duracionTurnoEnMins", "codigo", "tipoServicio", "costo"]
        const camposBody = Object.keys(body)
        const camposNoPermitidos = camposBody.filter((campo) => !camposPermitidos.includes(campo))

        if (camposNoPermitidos.length > 0) {
            throw new BadRequestError(`Campos no permitidos en la request: ${camposNoPermitidos.join(", ")}`)
        }

        let camposFaltantes

        if (body.tipoServicio === "practica") {
            camposFaltantes = camposPermitidos.filter((campo) => body[campo] === undefined)
        } else if (body.tipoServicio === "especialidad") {
            camposFaltantes = camposPermitidos.filter((campo) => body[campo] === undefined && campo != "codigo")
        } else {
            throw new BadRequestError(`Campo Tipo Servicio es inexistente o invalido`)
        }

        if (camposFaltantes.length > 0) {
            throw new BadRequestError(`Faltan campos obligatorios en la request: ${camposFaltantes.join(", ")}`)
        }

        const bodyValidado = {
            nombre: body.nombre,
            duracionTurnoEnMins: body.duracionTurnoEnMins,
            costo: body.costo,
            tipoServicio: body.tipoServicio
        }
        if (body.codigo) {
            bodyValidado.codigo = body.codigo
        }

        return bodyValidado
    }

    /* extraerFiltros(query) { posibles filtros: por costo, por duracion (raro buscar servicios por su duracion) 
        const filtros = {}

        if (query.costoMin !== undefined) {
            const costoMin = Number(query.costoMin)
            if (!Number.isFinite(costoMin)) {
                throw new BadRequestError("Costo Mínimo debe ser un número válido")
            }
            filtros.costoMin = costoMin
        }

        if (query.costoMax !== undefined) {
            const costoMax = Number(query.costoMax)
            if (!Number.isFinite(costoMax)) {
                throw new BadRequestError("Costo Máximo debe ser un número válido")
            }
            filtros.costoMax = costoMax
        }

        if (query.categoria !== undefined) {
            filtros.categoria = query.categoria
        }

        return filtros
    } */

    extraerPaginacion(query) {
        const numeroPagina = query?.page === undefined ? 1 : Number(query.page)
        const limitePorPagina = query?.limit === undefined ? 10 : Number(query.limit)

        this.validarEnteroPositivo(numeroPagina, "page")
        this.validarEnteroPositivo(limitePorPagina, "limit")

        return { numeroPagina, limitePorPagina }
    }

    validarEnteroPositivo(numero, parametro) {
        if (!Number.isInteger(numero) || numero <= 0) {
            throw new BadRequestError(`El parámetro ${parametro} debe ser un entero positivo`)
        }
    }
}