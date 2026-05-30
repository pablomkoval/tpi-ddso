import TurnoService from "../../services/turno.service.js";

export default class TurnoController {
    constructor() {
        this.turnoService = new TurnoService();
    }

    
}