import { ObraSocial } from "../domain/models/entities/planes/ObraSocial.js"
import { Plan } from "../domain/models/entities/planes/Plan.js";
import { NotFoundError, UnprocessableEntityError, ConflictError, BadRequestError } from "../shared/errors/AppError.js";

export class ObraSocialService {
    constructor(obraSocialRepository) {
        this.obraSocialRepository = obraSocialRepository;
    }

    async obtenerTodas() {
        const obrasSociales = await this.obraSocialRepository.findAll();

        return obrasSociales;
    }

    async findById(obraSocialId) {

        const obraSocial = await this.obraSocialRepository.findById(obraSocialId)

        if (!obraSocial) {
            throw new NotFoundError("Servicio no encontrado")
        }

        return obraSocial
    }

    async create(datosObraSocial) {
        const { nombre } = datosObraSocial.data;
        const nuevaObraSocial = new ObraSocial(nombre)

        return await this.obraSocialRepository.create(nuevaObraSocial)
    }

    async update(id, datosObraSocial) {
        const datosValidados = this.validarDatos(datosObraSocial)
        this.validarNombreDisponible(datosValidados.nombre, id)

        const obraSocialActualizada = await this.obraSocialRepository.update(id, datosValidados)
        return obraSocialActualizada
    }

    async delete(id) {
        const resultado = await this.obraSocialRepository.delete(id) //por default borrado logico

        if (!resultado) {
            throw new NotFoundError("Obra social no encontrada")
        }

        return resultado
    }

    validarDatos(datos) {

        if (!datos.success) {
            throw new UnprocessableEntityError(
                datos.error.issues
                    .map(issue => issue.message)
                    .join(", ")
            )
        }

        return datos.data
    }

    async validarNombreDisponible(nombre, idActual = null) {
        const obraSocialExistente = await this.obraSocialRepository.findByName(nombre)
        const existeObraSocialConMismoNombre = obraSocialExistente && obraSocialExistente.id !== idActual

        if (existeObraSocialConMismoNombre) {
            throw new ConflictError("Ya existe una obra social con el mismo nombre")
        }
    }

    ////////////////////// PLANES ////////////////////////


    async createPlan(obraSocialId, datosPlan) {
        const obraSocial = await this.obraSocialRepository.findById(obraSocialId)

        if (!obraSocial) {
            throw new BadRequestError("Obra Social no encontrada")
        }
        const datosNuevoPlan = datosPlan.data;
        this.validarNombrePlanDisponible(datosNuevoPlan.nombre)

        const nuevoPlan = new Plan(datosNuevoPlan.nombre, datosNuevoPlan.coberturasEspecialidad, datosNuevoPlan.coberturasPractica)
        const planCreado = await this.obraSocialRepository.createPlan(nuevoPlan)

        obraSocial.agregarPlan(planCreado._id)



        await this.obraSocialRepository.update(obraSocial._id, obraSocial)
        return planCreado
    }

    async updatePlan(planId, datosPlan) {

        const datosValidados = this.validarDatos(datosPlan)
        this.validarNombrePlanDisponible(datosValidados.nombre, planId)

        const planActualizado = await this.obraSocialRepository.updatePlan(planId, datosValidados)
        return planActualizado
    }

    async deletePlan(planId) {
        const resultado = await this.obraSocialRepository.deletePlan(planId)

        if (!resultado) {
            throw new NotFoundError("Plan no encontrado")
        }

        return resultado
    }

    async validarNombrePlanDisponible(nombre, idActual = null) {
        const planExistente = await this.obraSocialRepository.findPlanByName(nombre)
        const existePlanConMismoNombre = planExistente && planExistente.id !== idActual

        if (existePlanConMismoNombre) {
            throw new ConflictError("Ya existe un plan con el mismo nombre")
        }
    }

}