import { BadRequestError } from "../shared/errors/AppError.js";
import { servicioService } from "../services/servicio.service.js";
import { parsearId } from "../utils/parsearId.js";
import { validarEnteroPositivo } from "../utils/validarEnteroPositivo.js"
//import { servicioMedSchema } from "../validators/servicioMed.schema.js";
import { servicioSchema } from "../validators/servicio.schema.js";
import { TipoServicio } from "../domain/enum/TipoServicio.js";


export class ServiciosController {
    constructor() {
        this.servicioService = servicioService; // instancia unica, mas prolijo con 1 solo archivo centralizado "dependencies.js"
    }


    findAll = async (req, res, next) => { //listar todos los servicios, un médico solo realmente no buscaria todos los servicios de otros médicos
        try {
            const paginacion = this.extraerPaginacion(req.query)
            //const filtros = this.extraerFiltros(req.query)
            const resultado = await this.servicioService.findAll({ ...paginacion/* , filtros */ })

            return res.status(200).json({
                status: "success",
                data: resultado.serviciosFormateados,
                paginacion: {
                    numeroPagina: resultado.numeroPagina,
                    limitePorPagina: resultado.limitePorPagina,
                    totalPaginas: resultado.totalPaginas,
                    totalServicios: resultado.totalServicios
                }
            })
        } catch (error) {
            return next(error)
        }
    }

    create = async (req, res, next) => {
        try {
            const datosServicio = this.extraerYValidarBodyServicio(req.body)
            const servicioCreado = await this.servicioService.create(datosServicio)

            return res.status(201).json({ status: "success", data: servicioCreado })
        } catch (error) {
            return next(error)
        }
    }

    findById = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            const servicio = await this.servicioService.findById(id)

            return res.status(200).json({ status: "success", data: servicio })
        } catch (error) {
            return next(error)
        }
    }

    update = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            const datosServicio = this.extraerYValidarBodyServicio(req.body)
            const servicioActualizado = await this.servicioService.update(id, datosServicio)

            return res.status(200).json({ status: "success", data: servicioActualizado })
        } catch (error) {
            return next(error)
        }
    }

    seed = async (req, res, next) => { //datos hardcodeados
        const SERVICIOS_INICIALES = [
            { nombre: "Consulta Pediátrica", tipoServicio: TipoServicio.ESPECIALIDAD },
            { nombre: "Control Cardiológico", tipoServicio: TipoServicio.ESPECIALIDAD },
            { nombre: "Consulta Dermatológica", tipoServicio: TipoServicio.ESPECIALIDAD },
            { nombre: "Consulta Endocrinológica", tipoServicio: TipoServicio.ESPECIALIDAD },
            { nombre: "Vacunación", tipoServicio: TipoServicio.PRACTICA },
            { nombre: "Tomografía Computada", tipoServicio: TipoServicio.PRACTICA },
            { nombre: "Resonancia Magnética", tipoServicio: TipoServicio.PRACTICA },
            { nombre: "Consulta Oncológica", tipoServicio: TipoServicio.ESPECIALIDAD }
        ]

        try {
            const listaServicios = Array.isArray(req.body) && req.body.length > 0 ? req.body : SERVICIOS_INICIALES
            const serviciosCreados = await this.servicioService.createSeveral(listaServicios)

            return res.status(201).json({ status: "success", data: serviciosCreados })
        } catch (error) {
            return next(error)
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            const servicioEliminado = await this.servicioService.delete(id)

            return res.status(200).json({ status: "success", data: servicioEliminado })
        } catch (error) {
            return next(error)
        }
    }

    extraerYValidarBodyServicio(body) {
        const resultado = servicioSchema.safeParse(body)

        if (!resultado.success) {
            throw new BadRequestError(
                resultado.error.issues.map(i => i.message).join(", ")
            )
        }

        return resultado.data
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

        validarEnteroPositivo(numeroPagina, "page")
        validarEnteroPositivo(limitePorPagina, "limit")

        return { numeroPagina, limitePorPagina }
    }
}

