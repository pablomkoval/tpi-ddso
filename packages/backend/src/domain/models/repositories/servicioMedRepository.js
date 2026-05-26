import { ServicioMedModel } from "../../../schemas/servicioMedSchema";

export class ServicioMedRepository {


    constructor() {
        this.model = ServicioMedModel;
    }

    async findAll() {
        return await this.model.find({ eliminado: false });
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findByName(nombre) {
        return await this.model.findOne({ nombre });
    }

    async save(servicioMed) {
        const nuevoServicioMed = new this.model(servicioMed);
        return await nuevoServicioMed.save(); // puede reducirse a un this.model.create(servicioMed)
    }
    async update(id, servicioMedModificado) {
        return await this.model.findByIdAndUpdate(id, servicioMedModificado, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
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

    async softDelete(id) {
        return await this.model.findByIdAndUpdate(id,
            {
                eliminado: true
            },
            {
                new: true
            }
        )
    }
}