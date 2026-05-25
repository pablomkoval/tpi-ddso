import { MedicoModel } from "../../../schemas/MedicoSchema.js";

export default class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }
}