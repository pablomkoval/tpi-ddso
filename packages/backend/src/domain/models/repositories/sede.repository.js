import { SedeModel } from "../../../schemas/sede.schema.js";

export class SedeRepository {
    constructor() {
        this.model = SedeModel;
    }

    async save(data) {
        const nuevo = new this.model(data);
        return await nuevo.save();
    }

    async findAll() {
        return await this.model.find();
    }

    /* async findById(id) {
        return await this.model.findById(id).populate('plan');
    }
    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    } */
}