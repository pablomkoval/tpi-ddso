import { parsearId } from "../utils/parsearId.js";
import { BadRequestError } from "../shared/errors/AppError.js";
import {
  confirmarSolicitudCambioTurnoSchema,
  createSolicitudCambioTurnoSchema,
  rechazarSolicitudCambioTurnoSchema,
} from "../validators/solicitudCambioTurno.schema.zod.js";

export class SolicitudCambioTurnoController {
  constructor(solicitudCambioTurnoService) {
    this.solicitudCambioTurnoService = solicitudCambioTurnoService;
  }

  solicitudToDTO(solicitud) {
    const formatTurno = (t) => {
      if (!t || !t.fechaHora) return t;
      const servicio = t.servicio || {};
      const servicioUnico = servicio.servicioUnico || {};
      return {
        id: t.id || t._id,
        fechaHora: t.fechaHora,
        estado: t.estado,
        costo: t.costo,
        servicio: {
          id: servicioUnico._id ?? servicio._id ?? null,
          nombre: servicioUnico.nombre ?? servicio.nombre ?? '—',
          tipo: servicioUnico.tipoServicio ?? null,
        }
      };
    };

    return {
      id: solicitud.id || solicitud._id,
      turnoOriginal: formatTurno(solicitud.turnoOriginal),
      turnoNuevo: formatTurno(solicitud.turnoNuevo),
      solicitanteId: solicitud.solicitanteId,
      pacienteId: solicitud.pacienteId,
      medicoId: solicitud.medicoId,
      estado: solicitud.estado,
      fechaSolicitud: solicitud.fechaSolicitud,
      fechaResolucion: solicitud.fechaResolucion,
      confirmadorId: solicitud.confirmadorId,
      motivo: solicitud.motivo,
      motivoRechazo: solicitud.motivoRechazo,
    };
  }

  async crearSolicitud(req, res, next) {
    try {
      const data = createSolicitudCambioTurnoSchema.parse(req.body);
      const solicitud = await this.solicitudCambioTurnoService.solicitarCambio(
        data,
      );
      return res.status(201).json(this.solicitudToDTO(solicitud));
    } catch (error) {
      return next(error);
    }
  }

  async obtenerPorId(req, res, next) {
    try {
      const id = parsearId(req.params.id);
      const solicitud = await this.solicitudCambioTurnoService.obtenerPorId(id);
      return res.status(200).json(this.solicitudToDTO(solicitud));
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const { pacienteId, medicoId } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if ((pacienteId && medicoId) || (!pacienteId && !medicoId)) {
        throw new BadRequestError(
          "Debe especificar pacienteId o medicoId",
          "FILTRO_REQUERIDO",
        );
      }

      const resultado = pacienteId
        ? await this.solicitudCambioTurnoService.listarPorPaciente(
            pacienteId,
            page,
            limit,
          )
        : await this.solicitudCambioTurnoService.listarPorMedico(
            medicoId,
            page,
            limit,
          );

      return res.status(200).json({
        solicitudes: resultado.solicitudes.map((s) => this.solicitudToDTO(s)),
        pagination: {
          total: resultado.total,
          page: resultado.page,
          limit: resultado.limit,
          totalPages: resultado.totalPages,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async confirmar(req, res, next) {
    try {
      const id = parsearId(req.params.id);
      const data = confirmarSolicitudCambioTurnoSchema.parse(req.body);
      const solicitud = await this.solicitudCambioTurnoService.confirmarSolicitud(
        id,
        data.confirmadorId,
      );
      return res.status(200).json(this.solicitudToDTO(solicitud));
    } catch (error) {
      return next(error);
    }
  }

  async rechazar(req, res, next) {
    try {
      const id = parsearId(req.params.id);
      const data = rechazarSolicitudCambioTurnoSchema.parse(req.body);
      const solicitud = await this.solicitudCambioTurnoService.rechazarSolicitud(
        id,
        data.confirmadorId,
        data.motivoRechazo,
      );
      return res.status(200).json(this.solicitudToDTO(solicitud));
    } catch (error) {
      return next(error);
    }
  }
}
