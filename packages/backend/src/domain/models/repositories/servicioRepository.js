import { ServicioModel } from "../../../schemas/ServicioSchema.js";

export class ServicioRepository {


    constructor() {
        this.model = ServicioModel;
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

    async save(datosServicio) {
        return await this.model.create(datosServicio)
    }
    async update(id, servicioModificado) {
        return await this.model.findByIdAndUpdate(id, servicioModificado, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async count() {
        const contado = await this.model.countDocuments({ eliminado: false })
        return contado
    }

    async saveAll(listaServicios) {
        return await this.model.insertMany(listaServicios)
    }


    async findAllPaginated(numeroPagina, limitePorPagina/* , filtros = {} */) {
        const skip = (numeroPagina - 1) * limitePorPagina

        const servicios =
            await this.model
                .find({ eliminado: false })
                .skip(skip)
                .limit(limitePorPagina)

        // logica de filtros si se necesitase
        const totalServicios = await this.count()
        return {
            servicios,
            totalServicios,
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