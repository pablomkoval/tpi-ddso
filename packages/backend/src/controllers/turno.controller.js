
import { extraerPaginacion } from "../utils/extraerPaginacion.js";
import { filtroBusqTurnoPaciente } from "../validators/turnos.schema.zod.js";
import { BadRequestError } from "../shared/errors/AppError.js";


export class TurnoController {
  

  constructor(turnoService, pacienteService) {
    this.turnoService = turnoService;
    this.pacienteService = pacienteService;
  }


  // CAMBIAR O AGREGAR UN OBTENERFILTRADOS() SEA EN CONTROLLER
  // O EN SERVICE

  async getDisponibles(req, res, next) {
    try {

      
      const paciente = await this.pacienteService.findByIdUsuario(req.user.id);
      
      const paginacion = extraerPaginacion(req.query);
      const filtros = this.validarFiltros(req.query);
      const resultado = await this.turnoService.buscarDisponibles(paginacion, filtros, paciente);
      
      res.status(200).json({
        status: "success",
        data:{
          turnos: resultado.turnos.map(t => this.turnoDisponibleToDTO(t)),
          pagination: resultado.pagination
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /* async getDisponiblesFiltrados(req, res, next) {
    try {

      const paginacion = extraerPaginacion(req.query);
      const filtros = this.validarFiltros(req.query);
      const resultado = await this.turnoService.buscarDisponiblesFiltrados({ ...paginacion, filtros });

      res.status(200).json({
        status: "success",
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
 */
  async getById(req, res, next) {
    try {
      const turno = await this.turnoService.obtenerPorId(req.params.id);
      
      let turnoConCosto = turno;
      if (req.user) {
        try {
          const paciente = await this.pacienteService.findByIdUsuario(req.user.id);
          if (paciente) {
            const turnoObj = turno.toObject ? turno.toObject() : turno;
            const populados = this.turnoService.popularCostosTurnos([turnoObj], paciente);
            turnoConCosto = populados[0];
          }
        } catch (e) {
          return next(e);
        }
      }

      res.status(200).json({
        status: "success",
        data: this.turnoDetalleToDTO(turnoConCosto),
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
        return res.status(400).json({ status: "error", message: "Debe indicar el estado destino" });
      }

      if (estado === "RESERVADO") {
        const { pacienteId } = datos;
        if (!pacienteId) {
          return res.status(400).json({ status: "error", message: "Debe indicar el pacienteId para reservar" });
        }
        // Usamos pacienteService para mantener todas las validaciones de negocio
        // (estado disponible, notificación al médico, etc.)
        const turnoReservado = await this.pacienteService.reservarTurno(pacienteId, id);
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

      return res.status(400).json({ status: "error", message: `Estado '${estado}' no válido` });

    } catch (error) {
      next(error);
    }
  }


  validarFiltros(query) {
    const resultado = filtroBusqTurnoPaciente.safeParse(query)

    if (!resultado.success) {
      throw new BadRequestError(
        resultado.error.issues.map(i => i.message).join(", ")
      )
    }

    return resultado.data
  }

  turnoDisponibleToDTO(turno){
    return {
        id: turno._id,

        fechaHora: turno.fechaHora,

        medico: {
            id: turno.medico._id,
            nombre: turno.medico.nombre,
        },

        sede: {
            id: turno.sede._id,
            nombre: turno.sede.nombre,
            direccion: turno.sede.direccion,
        },

        servicio: {
            id: turno.servicio.servicioUnico._id,
            nombre: turno.servicio.servicioUnico.nombre,
            tipo: turno.servicio.servicioUnico.tipoServicio,
            duracionMinutos: turno.servicio.duracionTurnoEnMins,
        },

        cobertura: turno.cobertura,
        costoPaciente: turno.costoPaciente,
    };

  }

  turnoDetalleToDTO(turno) {
    const servicio = turno.servicio || {};
    const servicioUnico = servicio.servicioUnico || {};

    return {
      id: turno._id,

      fechaHora: turno.fechaHora,
      estado: turno.estado,
      costo: turno.costo ?? 0,
      cobertura: turno.cobertura,
      costoPaciente: turno.costoPaciente,

      medico: turno.medico
        ? { id: turno.medico._id, nombre: turno.medico.nombre }
        : null,

      sede: turno.sede
        ? { id: turno.sede._id, nombre: turno.sede.nombre, direccion: turno.sede.direccion }
        : null,

      servicio: {
        id: servicioUnico._id ?? servicio._id ?? null,
        nombre: servicioUnico.nombre ?? servicio.nombre ?? '—',
        tipo: servicioUnico.tipoServicio ?? null,
        duracionMinutos: servicio.duracionTurnoEnMins ?? null,
      },
    };
  }



}

//poner error si mandan otra cosa que no sea RESERVADO o CANCELADO, tipo error de estado no valido algo asi
/* async reservar(req, res, next) {
  try {
    const turnoReservado = await this.turnoService.reservarTurno(req.params.id, req.body);
    return res.status(200).json(turnoReservado); 
    async cancelar(req, res, next) {
  try {
    await this.turnoService.cancelarTurno(req.params.id, req.body);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
    
    */
