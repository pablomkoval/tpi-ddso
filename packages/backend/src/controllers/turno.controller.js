
export class TurnoController {
  constructor(turnoService) {
    this.turnoService = turnoService;
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

  async cambiarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { estado, ...datos } = req.body

      if (!estado) {
        //error de que falta poner estado del turno en el body
      }

      if (estado === "RESERVADO") {
        const turnoReservado = await this.turnoService.reservarTurno(id, datos);
        return res.status(200).json({ 
          status: "success", 
          data: turnoReservado, 
        });
      } 
      
      if (estado === "CANCELADO") {
        const turnoCancelado = await this.turnoService.cancelarTurno(id, datos);
        return res.status(200).json({ 
          status: "success", 
          data: turnoCancelado 
        });
      }

      //poner error si mandan otra cosa que no sea RESERVADO o CANCELADO, tipo error de estado no valido algo asi
    } catch (error) {
      next(error);
    }
  }
}

