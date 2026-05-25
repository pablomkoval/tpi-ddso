import { MedicoModel } from "../../../schemas/MedicoSchema.js";

export default class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }

    async save(medico) {
        const nuevoMedico = new this.model(medico);
        return await nuevoMedico.save();
    }

    async findall() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async 
}