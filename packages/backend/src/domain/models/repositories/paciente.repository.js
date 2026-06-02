import { PacienteModel } from "../../../schemas/paciente.schema.js";

export class PacienteRepository {
    constructor() {
        this.model = PacienteModel;
    }
}