import turnoRepository from "../repositories (deprecado)/turnoRepository.js";
import especialidadRepository from "../repositories (deprecado)/especialidadRepository.js";
import medicoRepository from "../repositories (deprecado)/medicoRepository.js";
import pacienteRepository from "../repositories (deprecado)/pacienteRepository.js";
import { NivelCobertura } from "../domain/enum/NivelCobertura.js";
import { AppError } from "../shared/errors/AppError.js";
// enviar a un .env
const PORCENTAJE_PAGO_PARCIAL = 0.5;

const obtenerId = (valor) => {
  if (!valor) return null;
  return valor._id ?? valor;
};

const obtenerCostoBase = (turno) => {
  if (Number.isFinite(turno.costo)) {
    return turno.costo;
  }
  if (Number.isFinite(turno?.practica?.costo)) {
    return turno.practica.costo;
  }
  if (Number.isFinite(turno?.especialidad?.costoConsulta)) {
    return turno.especialidad.costoConsulta;
  }
  return 0;
};

const obtenerNivelCobertura = (turno, plan) => {
  if (!plan) {
    return NivelCobertura.NO_CUBIERTA;
  }

  const idPractica = obtenerId(turno?.practica);
  if (idPractica) {
    const coberturasPractica = Array.isArray(plan.coberturasPractica)
      ? plan.coberturasPractica
      : [];
    const cobertura = coberturasPractica.find(
      (item) => String(obtenerId(item.practica)) === String(idPractica),
    );
    return cobertura?.nivel ?? NivelCobertura.NO_CUBIERTA;
  }

  const idEspecialidad = obtenerId(turno?.especialidad);
  if (idEspecialidad) {
    const coberturasEspecialidad = Array.isArray(plan.coberturasEspecialidad)
      ? plan.coberturasEspecialidad
      : [];
    const cobertura = coberturasEspecialidad.find(
      (item) => String(obtenerId(item.especialidad)) === String(idEspecialidad),
    );
    return cobertura?.nivel ?? NivelCobertura.NO_CUBIERTA;
  }

  return NivelCobertura.NO_CUBIERTA;
};

const calcularCostoPaciente = (costoBase, nivelCobertura) => {
  const costoNormalizado = Number.isFinite(costoBase) ? costoBase : 0;

  switch (nivelCobertura) {
    case NivelCobertura.TOTAL:
      return 0;
    case NivelCobertura.PARCIAL:
      return Number((costoNormalizado * PORCENTAJE_PAGO_PARCIAL).toFixed(2));
    case NivelCobertura.NO_CUBIERTA:
    default:
      return costoNormalizado;
  }
};

class TurnoService {
  async buscarDisponibles(params) {
    const {
      especialidad,
      practica,
      profesional,
      sede,
      fechaDesde,
      fechaHasta,
      paciente,
      page = 1,
      limit = 10,
      sortBy = "fechaHora",
      sortOrder = "asc",
    } = params;

    if (!especialidad && !practica) {
      throw new AppError(
        "Debe especificar al menos una especialidad o práctica para buscar turnos",
        400,
        "FILTRO_REQUERIDO",
      );
    }

    if (especialidad) {
      const especialidadExistente =
        await especialidadRepository.findById(especialidad);
      if (!especialidadExistente) {
        throw new AppError(
          "La especialidad especificada no existe",
          404,
          "ESPECIALIDAD_NO_ENCONTRADA",
        );
      }
    }

    if (profesional) {
      const medicoExistente = await medicoRepository.findById(profesional);
      if (!medicoExistente) {
        throw new AppError(
          "El profesional especificado no existe",
          404,
          "PROFESIONAL_NO_ENCONTRADO",
        );
      }
    }

    if (fechaDesde && isNaN(Date.parse(fechaDesde))) {
      throw new AppError(
        "La fecha de inicio no es válida",
        400,
        "FECHA_INVALIDA",
      );
    }

    if (fechaHasta && isNaN(Date.parse(fechaHasta))) {
      throw new AppError("La fecha de fin no es válida", 400, "FECHA_INVALIDA");
    }

    if (
      fechaDesde &&
      fechaHasta &&
      new Date(fechaDesde) > new Date(fechaHasta)
    ) {
      throw new AppError(
        "La fecha de inicio no puede ser posterior a la fecha de fin",
        400,
        "RANGO_FECHA_INVALIDO",
      );
    }

    if (!paciente) {
      throw new AppError(
        "Debe especificar un paciente para calcular la cobertura",
        400,
        "PACIENTE_REQUERIDO",
      );
    }

    const pacienteExistente = await pacienteRepository.findById(paciente);
    if (!pacienteExistente) {
      throw new AppError(
        "El paciente especificado no existe",
        404,
        "PACIENTE_NO_ENCONTRADO",
      );
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const camposOrdenamiento = ["fechaHora", "costo"];
    const sortField = camposOrdenamiento.includes(sortBy)
      ? sortBy
      : "fechaHora";
    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sort = { [sortField]: sortDirection };

    const filtros = {
      especialidad: especialidad || null,
      practica: practica || null,
      medico: profesional || null,
      sede: sede || null,
      fechaDesde: fechaDesde || null,
      fechaHasta: fechaHasta || null,
    };

    const { turnos, total } = await turnoRepository.buscarDisponibles(filtros, {
      skip,
      limit: limitNum,
      sort,
    });

    const turnosEnriquecidos = turnos.map((turno) => {
      const nivelCobertura = obtenerNivelCobertura(
        turno,
        pacienteExistente.plan,
      );
      const costoBase = obtenerCostoBase(turno);
      const costoPaciente = calcularCostoPaciente(costoBase, nivelCobertura);

      return {
        ...turno,
        cobertura: nivelCobertura,
        costoPaciente,
      };
    });

    const totalPages = Math.ceil(total / limitNum);

    return {
      turnos: turnosEnriquecidos,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    };
  }

  async obtenerPorId(id) {
    const turno = await turnoRepository.findById(id);
    if (!turno) {
      throw new AppError("Turno no encontrado", 404, "TURNO_NO_ENCONTRADO");
    }
    return turno;
  }

  async generarTurnos() {
    const medicos = await this.medicoRepository.findAll();

    medicos.forEach(medico => {
      medico.generarTurnos();
      medico.turnos.forEach(turno => this.turnoRepository.save(turno));
      this.medicoRepository.update(medico);
    })
  }

  async reservarTurno() {


  }

  async cancelarTurno() {


  }


}


export default TurnoService



