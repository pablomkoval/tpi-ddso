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
        return await this.model.findById(id).populate('plan');
    }

    async findByIdConPlan(id) {
        return await this.model.findById(id).populate('plan');
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
}