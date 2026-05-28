import { TurnoModel } from "../../../schemas/TurnoSchema.js";

export default class TurnoRepository {
    constructor() {
        this.model = TurnoModel;
    }

    async save(turno) {
        const nuevoTurno = new this.model(turno);
        return await nuevoTurno.save();
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }
}