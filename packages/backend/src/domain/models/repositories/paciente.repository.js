import { MedicoModel } from "../../../schemas/paciente.schema.js";

export default class PacienteRepository {
    constructor () {
        this.model = PacienteModel;
    }
}