import { ServicioMedModel } from "../../../schemas/ServicioMedSchema.js";

export class ServicioMedRepository {


    constructor() {
        this.model = ServicioMedModel;
    }

    async findAll() {
        return await this.model.find({ eliminado: false }).populate('servicioUnico');
    }

    async findById(id, session = null) {
        return await this.model.findById(id).session(session).populate('servicioUnico');
    }

    /* async findByName(nombre) {
        return await this.model.findOne({ nombre }).populate('servicioUnico');
    } */

    async save(datosServicioMed, session = null) {
        return await this.model.create([datosServicioMed], { session })
    }
    async update(id, ServicioMedModificado, session = null) {
        return await this.model.findByIdAndUpdate(id, ServicioMedModificado, { new: true, session }).populate('servicioUnico');
    }

    async delete(id, session = null) {
        return await this.model.findByIdAndDelete(id).session(session);
    }

    async count() {
        return this.model.countDocuments();
    }

    async saveAll(listaServicioMeds) {
        return await this.model.insertMany(listaServicioMeds)
    }

    // posibles filtros
    /* async findByMinPrice(minPrice) {
        return await this.model.find({ costo: { $gt: minPrice } });
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
            await this.model.countDocuments({
                eliminado: false
            })

        return {
            servicioMeds,
            total,
        }
    }

    async softDelete(id, session = null) {
        return await this.model.findByIdAndUpdate(id,
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