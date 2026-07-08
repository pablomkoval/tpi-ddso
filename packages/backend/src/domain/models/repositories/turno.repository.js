import { TurnoModel } from "../../../schemas/turno.schema.js";

export class TurnoRepository {
  constructor() {
    this.model = TurnoModel;
  }

  async save(turno) {
    const nuevoTurno = new this.model(turno);
    return await nuevoTurno.save();
  }

  async guardar(turno) {
    return await turno.save();
  }

  async saveAll(turnos) {
    const turnosGuardados = await this.model.insertMany(turnos)
    return turnosGuardados
  }

  async findAll() {
    return await this.model.find();
  }

  async findById(id) {
    return await this.model
      .findById(id)
      .populate("medico")
      .populate({
        path: "servicio",
        populate: { path: "servicioUnico" },
      })
      .populate("sede");
  }

  async findByIdConServicio(id) {
    return await this.model.findById(id).populate("servicio");
  }

  async findAllByDisponibilidad(disponibilidadID) {
    return await this.model.find({
      "disponibilidadOrigen._id": disponibilidadID,
      estado: "DISPONIBLE"
    });
  }


  async borrarTurnosPorDisponibilidad(disponibilidadID) {
    await this.model.deleteMany({
      "disponibilidadOrigen._id": disponibilidadID,
      estado: "DISPONIBLE"
    })
  }

  async findByPaciente(pacienteId) {
    return await this.model
      .find({ paciente: String(pacienteId) })
      .populate({
        path: 'servicio',
        populate: { path: 'servicioUnico' }
      })
      .populate('medico', 'nombre')
      .populate('sede', 'nombre direccion')
      .sort({ fechaHora: -1 });
  }

  /* async buscarDisponibles(filtros, opciones = {}) {
    const { skip = 0, limit = 10, sort = { fechaHora: 1 } } = opciones;

    const query = { estado: "DISPONIBLE" };

    // "prestacion" del filtro corresponde al campo "servicio" en el schema de Turno
    if (filtros.prestacion) {
      query.servicio = filtros.prestacion;
    }
    if (filtros.medico) {
      query.medico = filtros.medico;
    }
    if (filtros.sede) {
      query.sede = filtros.sede;
    }
    if (filtros.fechaDesde || filtros.fechaHasta) {
      query.fechaHora = {};
      if (filtros.fechaDesde)
        query.fechaHora.$gte = new Date(filtros.fechaDesde);
      if (filtros.fechaHasta)
        query.fechaHora.$lte = new Date(filtros.fechaHasta);
    }

    const [turnos, total] = await Promise.all([
      this.model
        .find(query)
        .populate("servicio")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query),
    ]);

    return { turnos, total };
  } */
  async buscarDisponibles(filtros) {
    const query = { estado: "DISPONIBLE" };


    if (filtros.servicios?.length > 0) {//deberia ser ya mayor a cero pero no vaya a ser
        query.servicio = {
            $in: filtros.servicios
        };
    }

    if (filtros.medico) {
        query.medico = filtros.medico;
    }

    if (filtros.sedeId) {
        query.sede = filtros.sedeId;
    }

    if (filtros.fechaDesde || filtros.fechaHasta) {
        query.fechaHora = {};

        if (filtros.fechaDesde) {
            query.fechaHora.$gte = new Date(filtros.fechaDesde);
        }

        if (filtros.fechaHasta) {
            query.fechaHora.$lte = new Date(filtros.fechaHasta);
        }
    }

    const turnosQuery = this.model
        .find(query)
        .populate("medico")
        .populate({
            path: "servicio",
            populate: {
                path: "servicioUnico"
            }
        })
        .populate("sede")
        .lean();

    const [turnos, total] = await Promise.all([
        turnosQuery,
        this.model.countDocuments(query)
    ]);

    return { turnos, total };
  }



}
