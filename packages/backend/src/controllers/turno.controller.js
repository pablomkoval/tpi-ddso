
import { extraerPaginacion } from "../utils/extraerPaginacion.js";
import { filtroBusqTurnoPaciente } from "../validators/turnos.schema.zod.js";
import { BadRequestError } from "../shared/errors/AppError.js";
import { parsearId } from "../utils/parsearId.js";


export class TurnoController {


  constructor(turnoService, pacienteService) {
    this.turnoService = turnoService;
    this.pacienteService = pacienteService;
  }


  // CAMBIAR O AGREGAR UN OBTENERFILTRADOS() SEA EN CONTROLLER
  // O EN SERVICE

  async getTurnos(req, res, next) {
    try {
      const paginacion = extraerPaginacion(req.query);
      const filtros = this.validarFiltrosGetTurnos(req.query);
      const resultado = await this.turnoService.findAll({
        ...paginacion,
        filtros,
      });

      res.status(200).json({
        status: "success",
        data: resultado.turnos.map((turno) => this.turnoDetalleToDTO(turno)),
        paginacion: {
          numeroPagina: resultado.numeroPagina,
          limitePorPagina: resultado.limitePorPagina,
          totalPaginas: resultado.totalPaginas,
          totalTurnos: resultado.totalTurnos,
        },
      });
    } catch (error) {
      next(error);
    }
  }


  async getDisponibles(req, res, next) {
    try {

      const paciente = await this.pacienteService.findByIdUsuario(req.user.id);
      const paginacion = extraerPaginacion(req.query);
      const filtros = this.validarFiltros(req.query);
      const resultado = await this.turnoService.buscarDisponibles(paginacion, filtros, paciente);
      res.status(200).json({
        status: "success",
        data: {
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
      const turnoId = parsearId(req.params.id);
      const estado = this.validarEstadoTurno(req.body.estado);

      const usuarioId = req.user.id;
      const usuarioRol = this.validarRolUsuario(req.body.rol);
      const motivoCambio = req.body.motivo;


      const turnoActualizado = await this.turnoService.cambiarEstado(turnoId, estado, usuarioId, usuarioRol, motivoCambio);
      //ver si cancelar devuelve el turno
      res.status(200).json({
        status: "success",
        data: this.turnoDetalleToDTO(turnoActualizado),
      });


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

  validarFiltrosGetTurnos(query = {}) {
    const filtros = {};
    const estadosValidos = ["DISPONIBLE", "RESERVADO", "CONFIRMADO", "CANCELADO", "COMPLETADO", "REALIZADO"];

    if (query.estado !== undefined && query.estado !== "") {
      const estadoNormalizado = String(query.estado).toUpperCase();
      if (!estadosValidos.includes(estadoNormalizado)) {
        throw new BadRequestError("Estado no válido");
      }
      filtros.estado = estadoNormalizado;
    }

    if (query.pacienteId !== undefined && query.pacienteId !== "") {
      filtros.pacienteId = parsearId(query.pacienteId);
    }

    if (query.medicoId !== undefined && query.medicoId !== "") {
      filtros.medicoId = parsearId(query.medicoId);
    }

    if (query.futuros !== undefined && query.futuro === "true"){
      filtros.futuros = true; 
    }

    return filtros;
  }

  validarEstadoTurno(estado) {
    const estadosValidos = ["RESERVADO", "CANCELADO", "CONFIRMADO", "REALIZADO"];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestError("Estado no válido");
    }
    return estado;
  }

  validarRolUsuario(rol) {
    const rolesValidos = ["PACIENTE", "MEDICO"];
    if (!rolesValidos.includes(rol)) {
      throw new BadRequestError("Rol de usuario no válido");
    }
    return rol;
  }



  turnoDisponibleToDTO(turno) {
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

