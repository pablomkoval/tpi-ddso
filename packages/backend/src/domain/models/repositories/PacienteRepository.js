import { MedicoModel } from "../../../schemas/PacienteSchema.js";

export default class PacienteRepository {
    constructor () {
        this.model = PacienteModel;
    }
}