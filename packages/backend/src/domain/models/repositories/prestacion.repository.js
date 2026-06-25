import { PracticaModel } from "../../../schemas/practica.schema.js"
import { EspecialidadModel } from "../../../schemas/especialidad.schema.js"
import { PrestacionModel } from "../../../schemas/prestacion.schema.js"

export class PrestacionRepository {


    constructor() {
        this.models = {
            practica: PracticaModel,
            especialidad: EspecialidadModel,
            prestacion: PrestacionModel
        }
    }

    async findAll() {
        return await this.models["prestacion"].find({ eliminado: false }).populate('servicioUnico')
    }

    async findById(id, session = null) {
        return await this.models["prestacion"].findById(id).populate('servicioUnico')
    }

    async findByServicioId(servicioId) {
        return await this.models["prestacion"]
        .find({ servicioUnico: servicioId })
        .populate("servicioUnico");
    }

    async save(datosPrestacion, session = null) {
        const prestacionCreado = await this.models[datosPrestacion.tipoServicio].create(datosPrestacion)
        return prestacionCreado
    }
    async update(id, PrestacionModificado, session = null) {
        return await this.models[PrestacionModificado.tipoServicio].findByIdAndUpdate(id, PrestacionModificado, { new: true/* , session */ }).populate('servicioUnico')
    }

    async delete(id, session = null) {
        return await this.models["prestacion"].findByIdAndDelete(id).session(session)
    }

    async count() {
        return this.model.countDocuments()
    }

    /* async saveAll(listaPrestaciones) {
        return await this.model.insertMany(listaPrestaciones)
    } */

    // posibles filtros
    /* async findByMinPrice(minPrice) {
        return await this.model.find({ costo: { $gt: minPrice } })
    }
    async findByPriceRange(min, max) {
    return await this.model.find({
        costo: { $gt: min, $lt: max }
    });
    } */

    async findAllPaginated(numeroPagina, limitePorPagina/* , filtros = {} */) {
        const skip = (numeroPagina - 1) * limitePorPagina

        const prestaciones =
            await this.model
                .find({ eliminado: false })
                .skip(skip)
                .limit(limitePorPagina)

        // logica de filtros si se necesitase

        const total =
            await this.models["prestacion"].countDocuments({
                eliminado: false
            })

        return {
            prestaciones,
            total,
        }
    }

    async softDelete(id, session = null) {
        return await this.models["prestacion"].findByIdAndUpdate(id,
            {
                eliminado: true
            },
            {
                new: true,
                session
            }
        )
    }
}