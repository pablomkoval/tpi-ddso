import { PracticaModel } from "../../../schemas/practica.schema.js"
import { EspecialidadModel } from "../../../schemas/especialidad.schema.js"
import { ServicioMedModel } from "../../../schemas/ServicioMed.schema.js"

export class ServicioMedRepository {


    constructor() {
        this.models = {
            practica: PracticaModel,
            especialidad: EspecialidadModel,
            servicioMed: ServicioMedModel
        }
    }

    async findAll() {
        return await this.models["servicioMed"].find({ eliminado: false }).populate('servicioUnico')
    }

    async findById(id, session = null) {
        console.error("ola 4: origins")
        return await this.models["servicioMed"].findById(id).populate('servicioUnico')
    }

    /* async findByName(nombre) {
        return await this.model.findOne({ nombre }).populate('servicioUnico')
    } */

    async save(datosServicioMed, session = null) {
        const servicioMedCreado = await this.models[datosServicioMed.tipoServicio].create(datosServicioMed)
        return servicioMedCreado
    }
    async update(id, ServicioMedModificado, session = null) {
        return await this.models[ServicioMedModificado.tipoServicio].findByIdAndUpdate(id, ServicioMedModificado, { new: true/* , session */ }).populate('servicioUnico')
    }

    async delete(id, session = null) {
        return await this.models["servicioMed"].findByIdAndDelete(id).session(session)
    }

    async count() {
        return this.model.countDocuments()
    }

    /* async saveAll(listaServicioMeds) {
        return await this.model.insertMany(listaServicioMeds)
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

        const servicioMeds =
            await this.model
                .find({ eliminado: false })
                .skip(skip)
                .limit(limitePorPagina)

        // logica de filtros si se necesitase

        const total =
            await this.models["servicioMed"].countDocuments({
                eliminado: false
            })

        return {
            servicioMeds,
            total,
        }
    }

    async softDelete(id, session = null) {
        return await this.models["servicioMed"].findByIdAndUpdate(id,
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