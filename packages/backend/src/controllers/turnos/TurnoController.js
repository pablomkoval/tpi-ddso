import TurnoService from "../../services/TurnoService.js";

export default class TurnoController {
    constructor() {
        this.turnoService = new TurnoService();
    }

    async reservar(req, res, next) {
        try {
            const turnoReservado = await this.turnoService.reservarTurno(req.params.id, req.body);
            return res.status(200).json(turnoReservado);
        } catch (error) {
            next(error);
        }
    }

    async cancelar(req, res, next) {
        try {
            await this.turnoService.cancelarTurno(req.params.id, req.body);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}