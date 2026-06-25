import { ServicioModel } from "../../../schemas/servicio.schema.js";

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


    async saveAll(listaServicios) {
        return await this.model.insertMany(listaServicios)
    }


    async findAllPaginated(numeroPagina, limitePorPagina, filtro = {}) {
        const skip = (numeroPagina - 1) * limitePorPagina

        const filtroCompleto = {
            eliminado: false,
            ...filtro
        }

        const servicios =
            await this.model
                .find(filtroCompleto)
                .skip(skip)
                .limit(limitePorPagina)


        const totalServicios = await this.model.countDocuments(filtroCompleto)
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