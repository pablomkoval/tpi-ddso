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

    async findById(id, session = null) {
        return await this.model.findById(id)
            .session(session)
            .populate('especialidades')
            .populate('practicas');
    }

    async guardar(medico, session = null) {
        return await medico.save({ session })
    }

    async findDisponibilidadesById(id) {
        try {
            const medico = await this.model.findById(id)
                .populate('disponibilidades')
                .populate('especialidades')
                .populate('practicas');

            if (!medico) {
                throw new Error('Médico no encontrado');
            }
            return medico.disponibilidades;
        } catch (error) {
            throw new Error(`Error al obtener disponibilidades: ${error.message}`, { cause: error });
        }
    }
}