import { MedicoModel } from "../../../schemas/MedicoSchema.js";

export default class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }

    async save(medico) {
        const nuevoMedico = new this.model(medico);
        return await nuevoMedico.save();
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async 

    async findDisponibilidadesById(id) {
        try {
            const medico = await this.model.findById(id).populate('disponibilidades');
            if (!medico) {
                throw new Error('Médico no encontrado');
            }
            return medico.disponibilidades;
        } catch (error) {
            throw new Error(`Error al obtener disponibilidades: ${error.message}`, { cause: error });
        }
    }
}