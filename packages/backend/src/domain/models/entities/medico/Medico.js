import { ServicioNoPrestadoError } from "../../../errors/ServicioNoPrestadoError.js";
import { DisponibilidadHoraria } from "./DisponibilidadHoraria.js";
import { Turno } from "../turnos/Turno.js";
import { HorarioInvalidoError } from "../../../errors/HorarioInvalidoError.js";
import { NotFoundError } from "../../../../shared/errors/AppError.js";

export default class Medico {
  disponibilidades = [];
  turnos = [];

  constructor(
    usuario,
    matricula,
    nombre,
    especialidades = [],
    practicas = [],
    sedes = [],
  ) {
    this.usuario = usuario;
    this.matricula = matricula;
    this.nombre = nombre;
    this.especialidades = especialidades;
    this.practicas = practicas;
    this.sedes = sedes;
  }
  ////////////////////////////    Servicios   /////////////////////////////////////////////////////
  agregarServicio(servicio) {
    if (servicio.tipoServicio === "practica") {
      this.practicas.push(servicio._id);
    } else {
      this.especialidades.push(servicio._id);
    }
  }

  quitarServicio(servicio) {
    if (servicio.tipoServicio === "practica") {
      this.practicas = this.practicas.filter((s) => !s.equals(servicio._id));
    } else {
      this.especialidades = this.especialidades.filter(
        (s) => !s.equals(servicio._id),
      );
    }
  }

  prestaServicio(servicio_id) {
    return (
      this.especialidades.some(
        (especialidad_id) => especialidad_id === servicio_id,
      ) || this.practicas.some((practica_id) => practica_id === servicio_id)
    );
  }

  prestaServicioPorId(servicio) {
    if (!servicio) return false;
    const idToCompare = String(servicio._id || servicio);
    return (
      this.especialidades.some(
        (esp) => String(esp._id || esp) === idToCompare,
      ) ||
      this.practicas.some((prac) => String(prac._id || prac) === idToCompare)
    );
  }

  serviciosMedTotales() {
    //dependiendo de frontend, puede convenir hacer una tupla o similar
    return [...this.especialidades, ...this.practicas];
  }

  ////////////////////////////    Sedes   /////////////////////////////////////////////////////

  agregarSede(nuevaSedeId) {
    this.sedes.push(nuevaSedeId);
  }

  obtenerSedes(){ //!!recorrer las disponibilidades y devolver las sedes unicas
    if (!this.disponibilidades){
      return null;
    }
  }

  ////////////////////////////    Disponibilidades   /////////////////////////////////////////////////////
  validarDisponibilidad(nuevaDisponibilidad) {
    // Validar que la nueva disponibilidad no se solape con las existentes
    if (
      this.disponibilidades.some((d) => {
        const disponibilidadVieja = new DisponibilidadHoraria({
          id: d.id || d._id,
          diaSemana: d.diaSemana,
          horaDesde: d.horaDesde,
          horaHasta: d.horaHasta,
          sede: d.sede?._id || d.sede,
          prestacion: d.prestacion?._id || d.prestacion,
        });
        return nuevaDisponibilidad.seSolapaCon(disponibilidadVieja);
      })
    ) {
      throw new HorarioInvalidoError(
        "La nueva disponibilidad se solapa con una disponibilidad existente",
      );
    }

    // Validar que el médico presete el servicio indicado en la disponibilidad
    if (!this.prestaServicioPorId(nuevaDisponibilidad.prestacion)) {
      const servicioNombre =
        nuevaDisponibilidad.prestacion?.nombre ||
        nuevaDisponibilidad.prestacion?.toString();
      throw new ServicioNoPrestadoError(
        `El médico "${this.nombre}" no presta el servicio "${servicioNombre}" requerido por la disponibilidad`,
      );
    }

    return nuevaDisponibilidad;
  }

  validarDisponibilidades(disponibilidades) {
    return disponibilidades.map((d) => this.validarDisponibilidad(d));
  }

  agregarDisponibilidades(nuevasDisponibilidades) {
    const disponibilidadesValidadas = this.validarDisponibilidades(
      nuevasDisponibilidades,
    );
    disponibilidadesValidadas.forEach((nuevaDisponibilidad) =>
      this.disponibilidades.push(nuevaDisponibilidad),
    );
  }

  editarDisponibilidad(disponibilidadId, cambios) {
    const disponibilidad = this.disponibilidades.find(
      (d) =>
        String(d.id) === String(disponibilidadId) ||
        String(d._id) === String(disponibilidadId),
    );
    if (!disponibilidad) {
      throw new NotFoundError(
        `No se encontró la disponibilidad con id "${disponibilidadId}"`,
      );
    }
    /*
    // Si se intenta asignar una sede nueva, verificar que esté autorizada para el médico
    if (cambios.sede) {
      const sedeValida = this.sedes.some((sede) => sede.equals(cambios.sede));
      if (!sedeValida) {
        throw new SedeNoAutorizadaError(
          `La sede con ID "${cambios.sede}" no está autorizada para el médico "${this.nombre}"`,
        );
      }
      }*/

    disponibilidad.diaSemana = cambios.diaSemana ?? disponibilidad.diaSemana;
    disponibilidad.horaDesde = cambios.horaDesde ?? disponibilidad.horaDesde;
    disponibilidad.horaHasta = cambios.horaHasta ?? disponibilidad.horaHasta;
    disponibilidad.sede = cambios.sede ?? disponibilidad.sede;
    disponibilidad.prestacion = cambios.prestacion ?? disponibilidad.prestacion;
  }
  ////////////////////////////    Turnos   /////////////////////////////////////////////////////

  tieneTurnoEn(fechaHora) {
    return this.turnos.some(
      (turno) => turno.fechaHora.getTime() === fechaHora.getTime(),
    );
  }

  generarTurnos(diasACubrir = 7) {
    const servicios = [...this.especialidades, ...this.practicas]; // A falta de clase abstracta "Servicio"
    // Devuelvo los turnos generados de todos los servicios del médico en un mismo array
    return servicios.flatMap((servicio) =>
      this.generarTurnosPara(servicio, diasACubrir),
    );
  }

  generarTurnosPara(servicio, diasACubrir = 7) {
    const turnosGenerados = [];
    if (!this.prestaServicioPorId(servicio)) {
      throw new ServicioNoPrestadoError(
        `El médico "${this.nombre}" no presta el servicio "${servicio.nombre}"`,
      );
    }
    const fechaInicio = new Date();
    const fechaFinal = new Date(fechaInicio);
    fechaFinal.setUTCDate(fechaFinal.getUTCDate() + diasACubrir);
    fechaFinal.setUTCHours(0, 0, 0, 0);
    const duracionTurnoEnMins = servicio.duracionTurnoEnMins;
    const siguienteFechaParaDia = (fechaBase, diaSemana) => {
      const fecha = new Date(fechaBase);
      const diff = (diaSemana - fecha.getUTCDay() + 7) % 7;
      fecha.setUTCDate(fecha.getUTCDate() + diff);
      fecha.setUTCHours(0, 0, 0, 0);
      return fecha;
    };

    const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;
    this.disponibilidades.forEach((disponibilidad) => {
      const prestacionId = disponibilidad.prestacion?._id ?? disponibilidad.prestacion;
      if (!prestacionId || String(prestacionId) !== String(servicio._id || servicio)) {
        // console.log(
        //   "La disponibilidad no corresponde al servicio, no se generan turnos para esta disponibilidad",
        // );
        return;
      }
      for (
        let fechaActual = siguienteFechaParaDia(
          fechaInicio,
          disponibilidad.diaSemana,
        );
        fechaActual < fechaFinal;
        fechaActual = new Date(fechaActual.getTime() + SEMANA_MS)
      ) {
        // me fijo todos los lunes hasta llegar al limite
        const instantes = disponibilidad.generarInstantesTurnoParaFecha(
          fechaActual,
          duracionTurnoEnMins,
        );
        for (const fechaHoraTurno of instantes) {
          if (this.tieneTurnoEn(fechaHoraTurno)) {
            continue;
          }
          const turno = new Turno(
            this._id,
            fechaHoraTurno,
            servicio,
            disponibilidad.sede,
            disponibilidad,
          );
          //this.turnos.push(turno);
          turnosGenerados.push(turno);
        }
      }
    });

    return turnosGenerados;
  }

  obtenerTurnos() {
    return [...this.turnos];
  }

  agregarTurno(turno) {
    this.turnos.push(turno._id);
  }

  quitarTurno(turno) {
    this.turnos = this.turnos.filter((t) => !t.equals(turno._id));
  }
}
