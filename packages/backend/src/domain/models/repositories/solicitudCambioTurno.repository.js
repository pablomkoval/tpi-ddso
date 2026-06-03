import { SolicitudCambioTurnoModel } from "../../../schemas/solicitudCambioTurno.schema.js";
import { EstadoSolicitudCambioTurno } from "../../enum/EstadoSolicitudCambioTurno.js";

export class SolicitudCambioTurnoRepository {
  constructor() {
    this.model = SolicitudCambioTurnoModel;
  }

  async save(solicitud) {
    const nuevaSolicitud = new this.model(solicitud);
    return await nuevaSolicitud.save();
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findPendienteByTurnoOriginal(turnoId) {
    return await this.model.findOne({
      turnoOriginal: turnoId,
      estado: EstadoSolicitudCambioTurno.PENDIENTE,
    });
  }

  async findAllPaginated(criterios = {}, page = 1, limit = 10) {
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const solicitudes = await this.model
      .find(criterios)
      .sort({ fechaSolicitud: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await this.model.countDocuments(criterios);

    return {
      solicitudes,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
  }
}
