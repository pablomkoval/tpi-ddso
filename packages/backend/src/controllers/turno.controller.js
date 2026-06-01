import TurnoService from "../services/turnoService.js";

class TurnoController {
  constructor() {
        this.turnoService = new TurnoService();
    }
  
  async getDisponibles(req, res, next) {
    try {
      const resultado = await this.turnoService.buscarDisponibles(req.query);

      res.status(200).json({
        status: "success",
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const turno = await this.turnoService.obtenerPorId(req.params.id);

      res.status(200).json({
        status: "success",
        data: turno,
      });
    } catch (error) {
      next(error);
    }
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

export default new TurnoController();
