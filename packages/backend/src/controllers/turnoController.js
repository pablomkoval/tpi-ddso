import turnoService from "../services/turnoService.js";

class TurnoController {

  async getDisponibles(req, res, next) {
    try {
      const resultado = await turnoService.buscarDisponibles(req.query);

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
      const turno = await turnoService.obtenerPorId(req.params.id);

      res.status(200).json({
        status: "success",
        data: turno,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TurnoController();
