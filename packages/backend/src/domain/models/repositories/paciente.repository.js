import { PacienteModel } from "../../../schemas/paciente.schema.js";
import '../../../schemas/plan.schema.js'; // Registrar el modelo Plan para que populate funcione

export class PacienteRepository {
    constructor() {
        this.model = PacienteModel;
    }

    async save(data) {
        const nuevo = new this.model(data);
        return await nuevo.save();
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id).populate({
            path: 'plan',
            populate: [
                { path: 'coberturasEspecialidad.prestacion' },
                { path: 'coberturasPractica.practica' }
            ]
        });
    }

    async findByIdUsuario(idUsuario){
        return await this.model.findOne({usuario: idUsuario}).populate({
            path: 'plan',
            populate: [
                { path: 'coberturasEspecialidad.servicio' },
                { path: 'coberturasPractica.servicio' }
            ]
        });
    }

    async findByUsername(username) {
        // Busca por campo usuario que contenga el username (útil para pacientes creados manualmente)
        return await this.model.findOne({ usuario: { $regex: username, $options: 'i' } }).populate({
            path: 'plan',
            populate: [
                { path: 'coberturasEspecialidad.prestacion' },
                { path: 'coberturasPractica.practica' }
            ]
        });
    }

    async updateUsuarioId(pacienteId, nuevoUsuarioId) {
        return await this.model.findByIdAndUpdate(
            pacienteId,
            { $set: { usuario: nuevoUsuarioId } },
            { new: true }
        );
    }

    async findByIdConPlan(id) {
        return await this.model.findById(id).populate({
            path: 'plan',
            populate: [
                { path: 'coberturasEspecialidad.prestacion' },
                { path: 'coberturasPractica.practica' }
            ]
        });
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
}