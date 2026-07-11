/* import turnoRepository from "../repositories (deprecado)/turnoRepository.js";
import especialidadRepository from "../repositories (deprecado)/especialidadRepository.js";
import medicoRepository from "../repositories (deprecado)/medicoRepository.js";
import pacienteRepository from "../repositories (deprecado)/pacienteRepository.js"; */
import { NivelCobertura } from "../domain/enum/NivelCobertura.js";
import AppError from "../shared/errors/AppError.js";
import { BadRequestError } from "../shared/errors/AppError.js";
import { EstadoTurno } from "../domain/enum/EstadoTurno.js";

// enviar a un .env
const PORCENTAJE_PAGO_PARCIAL = 0.5;
const MINUTOS_MINIMOS_CANCELACION = 60;



const obtenerId = (valor) => {
  if (!valor) return null;
  return valor._id ?? valor;
};

const obtenerCostoBase = (turno) => {
  if (Number.isFinite(turno?.servicio?.costo)) {
    return turno.servicio.costo;
  }
  if (Number.isFinite(turno.costo) && turno.costo > 0) {
    return turno.costo;
  }
  return 0;
};

const obtenerNivelCobertura = (turno, plan) => {
  if (!plan) {
    return NivelCobertura.NO_CUBIERTA;
  }

  // El campo en el schema de Turno se llama "servicio" y referencia a Prestacion.
  // El "tipoServicio" viene del discriminator de Prestacion.
  const servicio = turno?.servicio;
  if (!servicio) {
    return NivelCobertura.NO_CUBIERTA;
  }

  const idServicio = obtenerId(servicio);
  const idServicioUnicoTurno = obtenerId(servicio.servicioUnico);

  if (servicio.tipoServicio === "practica") {
    const coberturas = Array.isArray(plan.coberturasPractica)
      ? plan.coberturasPractica
      : [];
    const cobertura = coberturas.find((item) => {
      const practicaCobertura = item.practica;
      if (!practicaCobertura) return false;

      const idPracticaCobertura = obtenerId(practicaCobertura);
      if (String(idPracticaCobertura) === String(idServicio)) return true;

      const idServicioUnicoCobertura = obtenerId(practicaCobertura.servicioUnico);
      return idServicioUnicoCobertura && idServicioUnicoTurno &&
        String(idServicioUnicoCobertura) === String(idServicioUnicoTurno);
    });
    return cobertura?.nivel ?? NivelCobertura.NO_CUBIERTA;
  }

  const idEspecialidad = idServicio;
  if (idEspecialidad) {
    const coberturasEspecialidad = Array.isArray(plan.coberturasEspecialidad)
      ? plan.coberturasEspecialidad
      : [];
    const cobertura = coberturasEspecialidad.find((item) => {
      const prestacionCobertura = item.prestacion;
      if (!prestacionCobertura) return false;

      const idPrestacionCobertura = obtenerId(prestacionCobertura);
      if (String(idPrestacionCobertura) === String(idEspecialidad)) return true;

      const idServicioUnicoCobertura = obtenerId(prestacionCobertura.servicioUnico);
      return idServicioUnicoCobertura && idServicioUnicoTurno &&
        String(idServicioUnicoCobertura) === String(idServicioUnicoTurno);
    });
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

export class TurnoService {
  constructor(
    turnoRepository,
    medicoService,
    pacienteService,
    servicioService,
    notificacionesService,
  ) {
    this.turnoRepository = turnoRepository;
    this.medicoService = medicoService;
    this.pacienteService = pacienteService;
    this.servicioService = servicioService;
    this.notificacionesService = notificacionesService
  }


  //agregar parametro estado o rehacer, en cualquier caso utilizar zod para verificar los datos que llegan
  async buscarDisponibles(paginacion, filtros, paciente) {
    if (!filtros.servicioId) {
      throw new AppError(
        "Debe especificar al menos una especialidad o práctica para buscar turnos",
        400,
        "FILTRO_REQUERIDO",
      );
    }

    const prestacionesValidas = await this.servicioService.findPrestacionesByServicioId(filtros.servicioId);
    if (!prestacionesValidas || prestacionesValidas.length === 0) {
      throw new AppError(
        "No existen prestaciones de el servicio dado",
        404,
        "ESPECIALIDAD_NO_ENCONTRADA",
      );
    }

    const prestacionesValidasIds = prestacionesValidas.map(p => p._id);

    if (filtros.medicoId) {
      const medicoExistente = await this.medicoService.findById(filtros.medicoId);
      if (!medicoExistente) {
        throw new AppError(
          "El profesional especificado no existe",
          404,
          "PROFESIONAL_NO_ENCONTRADO",
        );
      }
    }

    if (
      filtros.fechaDesde &&
      filtros.fechaHasta &&
      new Date(filtros.fechaDesde) > new Date(filtros.fechaHasta)
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


    const filtroArmado = {
      servicios: prestacionesValidasIds,
      medico: filtros.medicoId || null,
      sede: filtros.sedeId || null,
      fechaDesde: filtros.fechaDesde || null,
      fechaHasta: filtros.fechaHasta || null,
    };

    const { turnos, totalTurnos } = await this.turnoRepository.buscarDisponibles(filtroArmado);
    const turnosConCostos = this.popularCostosTurnos(turnos, paciente);
    const turnosOrdenados = this.ordenarYPaginarTurnos(turnosConCostos, filtros, paginacion);

    const pagina = Number(paginacion.numeroPagina || paginacion.page || 1);
    const limite = Number(paginacion.limitePorPagina || paginacion.limit || 10);

    const totalPaginas = totalTurnos === 0 ? 0 : Math.ceil(totalTurnos / limite);

    return {
      turnos: turnosOrdenados,
      pagination: {
        totalTurnos,
        page: pagina,
        limit: limite,
        totalPaginas,
      },
    };
  }

  async obtenerPorId(id) {
    const turno = await this.turnoRepository.findById(id);
    if (!turno) {
      throw new AppError("Turno no encontrado", 404, "TURNO_NO_ENCONTRADO");
    }
    return turno;
  }

  async generarTurnos() {
    try {
      console.log("Antes de la búsqueda de médicos.")
      const medicos = await this.medicoService.findAllConTurnos();
      if (!medicos || medicos.length === 0) {
        throw new AppError(
          "Hubo un error al generar los turnos: no se encontraron médicos",
          500,
          "ERROR_GENERACION_TURNOS",
        );
      }

      const turnosGenerados = medicos.flatMap((medico) => medico.generarTurnos());

      /* console.log("Turnos generados.")
      console.error(JSON.stringify(turnosGenerados, null, 2)) */

      if (turnosGenerados.length > 0) {
        const turnosGuardados = await this.turnoRepository.saveAll(turnosGenerados);
        // Actualizo cada médico con los turnos generados para que queden reflejados en la base de datos

        turnosGuardados.forEach(async (turno) => {
          if (turno.medico) {

            await this.medicoService.agregarTurno(turno.medico, turno);
          }
        }
        )
      }

      console.log("Turnos guardados en la base de datos.")
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        error.mensaje ?? "Hubo un error al generar los turnos",
        500,
        "ERROR_GENERACION_TURNOS",
      );
    }
  }

  async actualizarTurnosDisponibles(disponibilidadId) {
    try {
      //const turnosAfectados = this.turnoRepository.findByDisponibilidad(disponibilidadId)
      await this.turnoRepository.borrarTurnosPorDisponibilidad(disponibilidadId)

    } catch (error) {
      throw new Error(`Error al actualizar turnos disponibles: ${error.message}`, { cause: error });
    }

  }

  async findAllByDisponibilidad(disponibilidadId) {
    try {
      //const turnosAfectados = this.turnoRepository.findByDisponibilidad(disponibilidadId)
      return await this.turnoRepository.findAllByDisponibilidad(disponibilidadId)

    } catch (error) {
      throw new Error(`Error al actualizar turnos disponibles: ${error.message}`, { cause: error });
    }
  }

  popularCostosTurnos(turnos, paciente) {
    return turnos.map((turno) => {
      const nivelCobertura = obtenerNivelCobertura(
        turno,
        paciente.plan,
      );
      const costoBase = obtenerCostoBase(turno);
      const costoPaciente = calcularCostoPaciente(costoBase, nivelCobertura);

      return {
        ...turno,
        cobertura: nivelCobertura,
        costoPaciente,
      };
    });
  }

  ordenarYPaginarTurnos(turnos, filtros, paginacion) {
    const pagina = Number(paginacion.numeroPagina || paginacion.page || 1);
    const limite = Number(paginacion.limitePorPagina || paginacion.limit || 10);

    const { sortBy = "fechaHora", sortOrder = 1 } = filtros;
    const orden = Number(sortOrder);

    // ORDENAR
    const ordenados = [...turnos].sort((a, b) => {

      let valueA;
      let valueB;

      switch (sortBy) {

        case "costo":
          valueA = a.costoPaciente ?? a.costo ?? 0;
          valueB = b.costoPaciente ?? b.costo ?? 0;
          break;

        case "fechaHora":
        default:
          valueA = new Date(a.fechaHora).getTime();
          valueB = new Date(b.fechaHora).getTime();
          break;
      }

      if (valueA < valueB) return -1 * orden;
      if (valueA > valueB) return 1 * orden;
      return 0;
    });

    // PAGINACION
    const start = (pagina - 1) * limite;
    const end = start + limite;

    const paginados = ordenados.slice(start, end);
    return paginados;
  }

  ////////// CAMBIO ESTADO TURNO ////////////////////////////////////////

  async cambiarEstado(turnoId, estado, usuarioId, usuarioRol, motivoCambio = null) {
    /// BUSCAR DATOS ////////
    const turno = await this.turnoRepository.findById(turnoId);
    if (!turno) {
      throw new AppError("Turno no encontrado", 404, "TURNO_NO_ENCONTRADO");
    }

    let usuarioRemitente;
    console.error("hola2");

    if (usuarioRol === "PACIENTE") {
      usuarioRemitente = await this.pacienteService.findByIdUsuario(usuarioId);
    } else if (usuarioRol === "MEDICO") {
      usuarioRemitente = await this.medicoService.findByIdUsuario(usuarioId);
    } else {
      throw new BadRequestError("Rol de usuario invalido", "ROL_USUARIO_INVALIDO")
    }
    if (!usuarioRemitente) {
      throw new AppError("Usuario no encontrado", 404, "USUARIO_NO_ENCONTRADO");
    }

    /// VALIDACIONES ////

    this.estadoValidoSegunRolUsuario(estado, usuarioRol);

    if (estado !== EstadoTurno.RESERVADO) {
      /* Si recien se quiere reservar, entonces lo hace el paciente
      y todavia no le corresponde el turno, no se debe correr el chequeo*/

      this.turnoCorrespondeAUsuario(turno, usuarioRemitente);
    } else{
      /* en efecto es una reserva, se tiene que asignar al turno */
      turno.paciente = String(usuarioRemitente._id)
    }

    if (estado === EstadoTurno.CANCELADO) {
      const minutosRestantes = (new Date(turno.fechaHora) - new Date()) / (1000 * 60);
      if (minutosRestantes < MINUTOS_MINIMOS_CANCELACION) {
        throw new BadRequestError(
          `Solo se puede cancelar con al menos ${MINUTOS_MINIMOS_CANCELACION} minutos de anticipación. ` +
          `Faltan ${Math.floor(minutosRestantes)} minutos para el turno.`,
          "CANCELACION_FUERA_DE_PLAZO",
        );
      }
    }
    console.error("hola final");

    /// GUARDAR TURNO /////
    turno.actualizarEstado(estado, usuarioRemitente._id, motivoCambio);

    const turnoActualizado = await this.turnoRepository.update(turnoId, turno);

    /// NOTIFICAR ////

    if (estado !== EstadoTurno.REALIZADO) {
      this.notificarCambioEstadoTurno(turnoActualizado, estado, usuarioRemitente, usuarioRol)
    }

    return turnoActualizado;
  }


  turnoCorrespondeAUsuario(turno, usuario) {
    if (String(turno.paciente) !== String(usuario._id) && String(turno.medico._id) !== String(usuario._id)) {
      

      throw new BadRequestError(
        "El turno no corresponde al usuario que intenta cambiar su estado",
        "USUARIO_NO_CORRESPONDE_TURNO",
      );
    }
  }


  estadoValidoSegunRolUsuario(estado, rolUsuario) {
    const estadosValidosMedico = [EstadoTurno.CONFIRMADO, EstadoTurno.REALIZADO, EstadoTurno.CANCELADO];
    const estadosValidosPaciente = [EstadoTurno.RESERVADO, EstadoTurno.CANCELADO];

    const esEstadoValido =
      (rolUsuario === "PACIENTE" && estadosValidosPaciente.includes(estado)) ||
      (rolUsuario === "MEDICO" && estadosValidosMedico.includes(estado));

    if (esEstadoValido) {
      return;
    }

    throw new BadRequestError(
      "El usuario no puede solicitar el cambio de turno a este estado",
      "USUARIO_NO_CORRESPONDE_ESTADO_TURNO",
    );
  }

  async notificarCambioEstadoTurno(turno, estadoTurno, usuarioRemitente, usuarioRol) {

    const nombreServicio = turno.servicio?.servicioUnico?.nombre ?? turno.servicio?.nombre ?? "servicio no especificado";
    const mensaje =
      usuarioRol === "PACIENTE"
        ? `El paciente ${usuarioRemitente.nombre} ha ${estadoTurno.toLowerCase()} el turno para ${nombreServicio}.`
        : `El profesional ${usuarioRemitente.nombre} ha ${estadoTurno.toLowerCase()} el turno para ${nombreServicio}.`;

    try {
      console.error("MI NOTIFICACIONES SERVICE: ",this.notificacionesService)
      await this.notificacionesService.create({
        destinatario: usuarioRol === "PACIENTE" ? turno.medico : turno.paciente,
        remitente: usuarioRemitente._id,
        mensaje,
      });
    } catch (notifErr) {
      console.error('[TurnoService] Error al enviar notificación de cambio estado turno:', notifErr.message);
    }
  }
}
