import { ObraSocialModel } from '../../../schemas/obraSocial.schema.js';

export class ObraSocialRepository {
    constructor() {
        this.model = ObraSocialModel;
    }

    async findAll() {
        return await this.model.find({}).populate('planes');
    }

    async findById(id) {
        return await this.model.findById(id).populate('planes');
    }
}