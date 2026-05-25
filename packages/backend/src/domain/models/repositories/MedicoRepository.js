import { MedicoModel } from "../../../schemas/MedicoSchema.js";

export default class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }

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