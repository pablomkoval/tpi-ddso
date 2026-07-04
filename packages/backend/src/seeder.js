import mongoose from "mongoose";
import { MongoDBClient } from "./config/database.js";
import { DiaSemana } from "./domain/enum/DiaSemana.js";
import { EstadoSolicitudCambioTurno } from "./domain/enum/EstadoSolicitudCambioTurno.js";
import { EstadoTurno } from "./domain/enum/EstadoTurno.js";
import { NivelCobertura } from "./domain/enum/NivelCobertura.js";
import { TipoServicio } from "./domain/enum/TipoServicio.js";
import { MedicoModel } from "./schemas/medico.schema.js";
import { NotificacionModel } from "./schemas/notificacion.schema.js";
import { ObraSocialModel } from "./schemas/obraSocial.schema.js";
import { PacienteModel } from "./schemas/paciente.schema.js";
import { PlanModel } from "./schemas/plan.schema.js";
import { PrestacionModel } from "./schemas/prestacion.schema.js";
import { SedeModel } from "./schemas/sede.schema.js";
import { ServicioModel } from "./schemas/servicio.schema.js";
import { SolicitudCambioTurnoModel } from "./schemas/solicitudCambioTurno.schema.js";
import { TurnoModel } from "./schemas/turno.schema.js";

const coleccionesAReiniciar = [
  TurnoModel,
  SolicitudCambioTurnoModel,
  NotificacionModel,
  MedicoModel,
  PacienteModel,
  PrestacionModel,
  ServicioModel,
  SedeModel,
  PlanModel,
  ObraSocialModel,
];

const diasDesdeHoy = (dias, hora, minutos = 0) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  fecha.setHours(hora, minutos, 0, 0);
  return fecha;
};

const historial = (estado, usuario, motivoCambio, fechaHoraCambio = new Date()) => [
  {
    estado,
    usuario,
    motivoCambio,
    fechaHoraCambio,
  },
];

const obtenerDisponibilidad = (medico, indice) =>
  medico.disponibilidades[indice].toObject();

const minutosDesdeHora = (hora) => {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
};

const crearFechaParaDiaYMinutos = (diaSemana, semana, minutosDelDia) => {
  const fecha = new Date();
  const diasHastaTurno = (Number(diaSemana) - fecha.getDay() + 7) % 7;
  fecha.setDate(fecha.getDate() + diasHastaTurno + semana * 7);
  fecha.setHours(Math.floor(minutosDelDia / 60), minutosDelDia % 60, 0, 0);
  return fecha;
};

const generarTurnosDisponibles = ({ medicos, prestaciones, turnosBase, semanas = 6 }) => {
  const prestacionPorId = Object.fromEntries(
    prestaciones.map((prestacion) => [String(prestacion._id), prestacion]),
  );
  const turnosExistentes = new Set(
    turnosBase.map((turno) => (
      `${turno.medico}-${turno.servicio}-${new Date(turno.fechaHora).toISOString()}`
    )),
  );
  const ahora = new Date();
  const turnos = [];

  medicos.forEach((medico) => {
    medico.disponibilidades.forEach((disponibilidad) => {
      const prestacion = prestacionPorId[String(disponibilidad.prestacion)];
      if (!prestacion) return;

      const desde = minutosDesdeHora(disponibilidad.horaDesde);
      const hasta = minutosDesdeHora(disponibilidad.horaHasta);
      const cantidadTurnos = Math.floor((hasta - desde) / prestacion.duracionTurnoEnMins);
      const slotsPorSemana = Math.min(cantidadTurnos, 5);

      for (let semana = 0; semana < semanas; semana += 1) {
        for (let slot = 0; slot < slotsPorSemana; slot += 1) {
          const minutosDelDia = desde + slot * prestacion.duracionTurnoEnMins;
          const fechaHora = crearFechaParaDiaYMinutos(
            disponibilidad.diaSemana,
            semana,
            minutosDelDia,
          );

          if (fechaHora <= ahora) continue;

          const clave = `${medico._id}-${prestacion._id}-${fechaHora.toISOString()}`;
          if (turnosExistentes.has(clave)) continue;

          turnosExistentes.add(clave);
          turnos.push({
            medico: medico._id,
            fechaHora,
            sede: disponibilidad.sede,
            servicio: prestacion._id,
            costo: prestacion.costo,
            estado: EstadoTurno.DISPONIBLE,
            disponibilidadOrigen: disponibilidad.toObject(),
            historialEstados: historial(
              EstadoTurno.DISPONIBLE,
              "SYSTEM",
              "Turno disponible generado por seed para pruebas de filtros",
            ),
          });
        }
      }
    });
  });

  return turnos;
};

try {
  await MongoDBClient.connect();

  await Promise.all(coleccionesAReiniciar.map((model) => model.deleteMany({})));

  const servicios = await ServicioModel.insertMany([
    { nombre: "Clinica Medica", tipoServicio: TipoServicio.ESPECIALIDAD },
    { nombre: "Pediatria", tipoServicio: TipoServicio.ESPECIALIDAD },
    { nombre: "Cardiologia", tipoServicio: TipoServicio.ESPECIALIDAD },
    { nombre: "Dermatologia", tipoServicio: TipoServicio.ESPECIALIDAD },
    { nombre: "Traumatologia", tipoServicio: TipoServicio.ESPECIALIDAD },
    { nombre: "Ginecologia", tipoServicio: TipoServicio.ESPECIALIDAD },
    { nombre: "Laboratorio", tipoServicio: TipoServicio.PRACTICA },
    { nombre: "Radiografia", tipoServicio: TipoServicio.PRACTICA },
    { nombre: "Ecografia", tipoServicio: TipoServicio.PRACTICA },
    { nombre: "Resonancia Magnetica", tipoServicio: TipoServicio.PRACTICA },
    { nombre: "Vacunacion", tipoServicio: TipoServicio.PRACTICA },
  ]);

  const servicioPorNombre = Object.fromEntries(
    servicios.map((servicio) => [servicio.nombre, servicio]),
  );

  const prestaciones = await PrestacionModel.insertMany([
    {
      servicioUnico: servicioPorNombre["Clinica Medica"]._id,
      tipoServicio: TipoServicio.ESPECIALIDAD,
      duracionTurnoEnMins: 30,
      costo: 12000,
    },
    {
      servicioUnico: servicioPorNombre.Pediatria._id,
      tipoServicio: TipoServicio.ESPECIALIDAD,
      duracionTurnoEnMins: 30,
      costo: 11000,
    },
    {
      servicioUnico: servicioPorNombre.Cardiologia._id,
      tipoServicio: TipoServicio.ESPECIALIDAD,
      duracionTurnoEnMins: 40,
      costo: 18000,
    },
    {
      servicioUnico: servicioPorNombre.Dermatologia._id,
      tipoServicio: TipoServicio.ESPECIALIDAD,
      duracionTurnoEnMins: 20,
      costo: 13500,
    },
    {
      servicioUnico: servicioPorNombre.Traumatologia._id,
      tipoServicio: TipoServicio.ESPECIALIDAD,
      duracionTurnoEnMins: 30,
      costo: 15000,
    },
    {
      servicioUnico: servicioPorNombre.Ginecologia._id,
      tipoServicio: TipoServicio.ESPECIALIDAD,
      duracionTurnoEnMins: 30,
      costo: 14500,
    },
    {
      servicioUnico: servicioPorNombre.Laboratorio._id,
      tipoServicio: TipoServicio.PRACTICA,
      duracionTurnoEnMins: 15,
      costo: 8000,
    },
    {
      servicioUnico: servicioPorNombre.Radiografia._id,
      tipoServicio: TipoServicio.PRACTICA,
      duracionTurnoEnMins: 20,
      costo: 9500,
    },
    {
      servicioUnico: servicioPorNombre.Ecografia._id,
      tipoServicio: TipoServicio.PRACTICA,
      duracionTurnoEnMins: 30,
      costo: 16000,
    },
    {
      servicioUnico: servicioPorNombre["Resonancia Magnetica"]._id,
      tipoServicio: TipoServicio.PRACTICA,
      duracionTurnoEnMins: 45,
      costo: 42000,
    },
    {
      servicioUnico: servicioPorNombre.Vacunacion._id,
      tipoServicio: TipoServicio.PRACTICA,
      duracionTurnoEnMins: 10,
      costo: 5000,
    },
  ]);

  const prestacionPorServicio = Object.fromEntries(
    prestaciones.map((prestacion) => [
      String(prestacion.servicioUnico),
      prestacion,
    ]),
  );
  const prestacionPorNombre = (nombre) =>
    prestacionPorServicio[String(servicioPorNombre[nombre]._id)];

  const sedes = await SedeModel.insertMany([
    { nombre: "Sede Centro", direccion: "Av. Corrientes 1234, CABA" },
    { nombre: "Sede Palermo", direccion: "Av. Santa Fe 3890, CABA" },
    { nombre: "Sede Belgrano", direccion: "Cabildo 2100, CABA" },
    { nombre: "Sede Avellaneda", direccion: "Av. Mitre 750, Avellaneda" },
  ]);

  const sedePorNombre = Object.fromEntries(
    sedes.map((sede) => [sede.nombre, sede]),
  );

  const planes = await PlanModel.insertMany([
    {
      nombre: "OSDE 210",
      coberturasEspecialidad: [
        {
          prestacion: prestacionPorNombre("Clinica Medica")._id,
          nivel: NivelCobertura.TOTAL,
        },
        {
          prestacion: prestacionPorNombre("Pediatria")._id,
          nivel: NivelCobertura.TOTAL,
        },
        {
          prestacion: prestacionPorNombre("Cardiologia")._id,
          nivel: NivelCobertura.PARCIAL,
        },
      ],
      coberturasPractica: [
        {
          practica: prestacionPorNombre("Laboratorio")._id,
          nivel: NivelCobertura.TOTAL,
        },
        {
          practica: prestacionPorNombre("Radiografia")._id,
          nivel: NivelCobertura.PARCIAL,
        },
        {
          practica: prestacionPorNombre("Resonancia Magnetica")._id,
          nivel: NivelCobertura.NO_CUBIERTA,
        },
      ],
    },
    {
      nombre: "OSDE 310",
      coberturasEspecialidad: prestaciones
        .filter((prestacion) => prestacion.tipoServicio === TipoServicio.ESPECIALIDAD)
        .map((prestacion) => ({
          prestacion: prestacion._id,
          nivel: NivelCobertura.TOTAL,
        })),
      coberturasPractica: prestaciones
        .filter((prestacion) => prestacion.tipoServicio === TipoServicio.PRACTICA)
        .map((prestacion) => ({
          practica: prestacion._id,
          nivel: prestacion.costo > 30000
            ? NivelCobertura.PARCIAL
            : NivelCobertura.TOTAL,
        })),
    },
    {
      nombre: "Swiss Medical SMG20",
      coberturasEspecialidad: [
        {
          prestacion: prestacionPorNombre("Clinica Medica")._id,
          nivel: NivelCobertura.TOTAL,
        },
        {
          prestacion: prestacionPorNombre("Dermatologia")._id,
          nivel: NivelCobertura.PARCIAL,
        },
        {
          prestacion: prestacionPorNombre("Traumatologia")._id,
          nivel: NivelCobertura.PARCIAL,
        },
      ],
      coberturasPractica: [
        {
          practica: prestacionPorNombre("Laboratorio")._id,
          nivel: NivelCobertura.TOTAL,
        },
        {
          practica: prestacionPorNombre("Ecografia")._id,
          nivel: NivelCobertura.PARCIAL,
        },
      ],
    },
    {
      nombre: "Galeno Oro",
      coberturasEspecialidad: prestaciones
        .filter((prestacion) => prestacion.tipoServicio === TipoServicio.ESPECIALIDAD)
        .map((prestacion) => ({
          prestacion: prestacion._id,
          nivel: NivelCobertura.PARCIAL,
        })),
      coberturasPractica: [
        {
          practica: prestacionPorNombre("Laboratorio")._id,
          nivel: NivelCobertura.TOTAL,
        },
        {
          practica: prestacionPorNombre("Vacunacion")._id,
          nivel: NivelCobertura.TOTAL,
        },
      ],
    },
    {
      nombre: "Particular",
      coberturasEspecialidad: [],
      coberturasPractica: [],
    },
  ]);

  const planPorNombre = Object.fromEntries(
    planes.map((plan) => [plan.nombre, plan]),
  );

  const obrasSociales = await ObraSocialModel.insertMany([
    {
      nombre: "OSDE",
      planes: [planPorNombre["OSDE 210"]._id, planPorNombre["OSDE 310"]._id],
    },
    {
      nombre: "Swiss Medical",
      planes: [planPorNombre["Swiss Medical SMG20"]._id],
    },
    {
      nombre: "Galeno",
      planes: [planPorNombre["Galeno Oro"]._id],
    },
    {
      nombre: "Particular",
      planes: [planPorNombre.Particular._id],
    },
  ]);

  const obraSocialPorNombre = Object.fromEntries(
    obrasSociales.map((obraSocial) => [obraSocial.nombre, obraSocial]),
  );

  const medicos = await MedicoModel.insertMany([
    {
      usuario: "usuario-medico-ana-rivas",
      matricula: "MN-102030",
      nombre: "Dra. Ana Rivas",
      especialidades: [
        prestacionPorNombre("Clinica Medica")._id,
        prestacionPorNombre("Cardiologia")._id,
      ],
      practicas: [prestacionPorNombre("Laboratorio")._id],
      sedes: [sedePorNombre["Sede Centro"]._id, sedePorNombre["Sede Palermo"]._id],
      disponibilidades: [
        {
          diaSemana: DiaSemana.LUNES,
          horaDesde: "09:00",
          horaHasta: "12:00",
          sede: sedePorNombre["Sede Centro"]._id,
          prestacion: prestacionPorNombre("Clinica Medica")._id,
        },
        {
          diaSemana: DiaSemana.MIERCOLES,
          horaDesde: "14:00",
          horaHasta: "18:00",
          sede: sedePorNombre["Sede Palermo"]._id,
          prestacion: prestacionPorNombre("Cardiologia")._id,
        },
        {
          diaSemana: DiaSemana.VIERNES,
          horaDesde: "08:00",
          horaHasta: "10:00",
          sede: sedePorNombre["Sede Centro"]._id,
          prestacion: prestacionPorNombre("Laboratorio")._id,
        },
      ],
    },
    {
      usuario: "usuario-medico-martin-sosa",
      matricula: "MN-203040",
      nombre: "Dr. Martin Sosa",
      especialidades: [
        prestacionPorNombre("Pediatria")._id,
        prestacionPorNombre("Dermatologia")._id,
      ],
      practicas: [prestacionPorNombre("Vacunacion")._id],
      sedes: [sedePorNombre["Sede Belgrano"]._id, sedePorNombre["Sede Centro"]._id],
      disponibilidades: [
        {
          diaSemana: DiaSemana.MARTES,
          horaDesde: "10:00",
          horaHasta: "13:00",
          sede: sedePorNombre["Sede Belgrano"]._id,
          prestacion: prestacionPorNombre("Pediatria")._id,
        },
        {
          diaSemana: DiaSemana.JUEVES,
          horaDesde: "16:00",
          horaHasta: "19:00",
          sede: sedePorNombre["Sede Centro"]._id,
          prestacion: prestacionPorNombre("Dermatologia")._id,
        },
        {
          diaSemana: DiaSemana.SABADO,
          horaDesde: "09:00",
          horaHasta: "11:00",
          sede: sedePorNombre["Sede Belgrano"]._id,
          prestacion: prestacionPorNombre("Vacunacion")._id,
        },
      ],
    },
    {
      usuario: "usuario-medico-laura-paz",
      matricula: "MN-304050",
      nombre: "Dra. Laura Paz",
      especialidades: [
        prestacionPorNombre("Traumatologia")._id,
        prestacionPorNombre("Ginecologia")._id,
      ],
      practicas: [
        prestacionPorNombre("Radiografia")._id,
        prestacionPorNombre("Ecografia")._id,
        prestacionPorNombre("Resonancia Magnetica")._id,
      ],
      sedes: [sedePorNombre["Sede Avellaneda"]._id, sedePorNombre["Sede Palermo"]._id],
      disponibilidades: [
        {
          diaSemana: DiaSemana.LUNES,
          horaDesde: "15:00",
          horaHasta: "19:00",
          sede: sedePorNombre["Sede Avellaneda"]._id,
          prestacion: prestacionPorNombre("Traumatologia")._id,
        },
        {
          diaSemana: DiaSemana.MIERCOLES,
          horaDesde: "09:00",
          horaHasta: "12:00",
          sede: sedePorNombre["Sede Palermo"]._id,
          prestacion: prestacionPorNombre("Ecografia")._id,
        },
        {
          diaSemana: DiaSemana.VIERNES,
          horaDesde: "13:00",
          horaHasta: "17:00",
          sede: sedePorNombre["Sede Avellaneda"]._id,
          prestacion: prestacionPorNombre("Resonancia Magnetica")._id,
        },
      ],
    },
  ]);

  const medicoPorNombre = Object.fromEntries(
    medicos.map((medico) => [medico.nombre, medico]),
  );

  const pacientes = await PacienteModel.insertMany([
    {
      usuario: "usuario-paciente-juan-perez",
      dni: "30111222",
      nombre: "Juan Perez",
      obraSocial: obraSocialPorNombre.OSDE._id,
      plan: planPorNombre["OSDE 210"]._id,
    },
    {
      usuario: "usuario-paciente-sofia-gomez",
      dni: "33222333",
      nombre: "Sofia Gomez",
      obraSocial: obraSocialPorNombre.OSDE._id,
      plan: planPorNombre["OSDE 310"]._id,
    },
    {
      usuario: "usuario-paciente-camila-nunez",
      dni: "35444555",
      nombre: "Camila Nunez",
      obraSocial: obraSocialPorNombre["Swiss Medical"]._id,
      plan: planPorNombre["Swiss Medical SMG20"]._id,
    },
    {
      usuario: "usuario-paciente-diego-rojas",
      dni: "28666777",
      nombre: "Diego Rojas",
      obraSocial: obraSocialPorNombre.Galeno._id,
      plan: planPorNombre["Galeno Oro"]._id,
    },
    {
      usuario: "usuario-paciente-maria-lopez",
      dni: "37888999",
      nombre: "Maria Lopez",
      obraSocial: obraSocialPorNombre.Particular._id,
      plan: planPorNombre.Particular._id,
    },
  ]);

  const pacientePorNombre = Object.fromEntries(
    pacientes.map((paciente) => [paciente.nombre, paciente]),
  );

  const turnoDisponibleAna = {
    medico: medicoPorNombre["Dra. Ana Rivas"]._id,
    fechaHora: diasDesdeHoy(2, 9, 0),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Clinica Medica")._id,
    costo: prestacionPorNombre("Clinica Medica").costo,
    estado: EstadoTurno.DISPONIBLE,
    disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dra. Ana Rivas"], 0),
    historialEstados: historial(
      EstadoTurno.DISPONIBLE,
      "SYSTEM",
      "Turno disponible generado por seed",
    ),
  };

  const turnoReservadoAna = {
    medico: medicoPorNombre["Dra. Ana Rivas"]._id,
    paciente: String(pacientePorNombre["Juan Perez"]._id),
    fechaHora: diasDesdeHoy(3, 14, 0),
    sede: sedePorNombre["Sede Palermo"]._id,
    servicio: prestacionPorNombre("Cardiologia")._id,
    costo: prestacionPorNombre("Cardiologia").costo,
    estado: EstadoTurno.RESERVADO,
    disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dra. Ana Rivas"], 1),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-2, 9, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(pacientePorNombre["Juan Perez"]._id),
        motivoCambio: "Reserva inicial para probar flujo paciente",
        fechaHoraCambio: diasDesdeHoy(-1, 11, 30),
      },
    ],
  };

  const turnoConfirmadoSosa = {
    medico: medicoPorNombre["Dr. Martin Sosa"]._id,
    paciente: String(pacientePorNombre["Sofia Gomez"]._id),
    fechaHora: diasDesdeHoy(4, 10, 0),
    sede: sedePorNombre["Sede Belgrano"]._id,
    servicio: prestacionPorNombre("Pediatria")._id,
    costo: prestacionPorNombre("Pediatria").costo,
    estado: EstadoTurno.CONFIRMADO,
    disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dr. Martin Sosa"], 0),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-4, 9, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(pacientePorNombre["Sofia Gomez"]._id),
        motivoCambio: "Reserva del paciente",
        fechaHoraCambio: diasDesdeHoy(-3, 15, 0),
      },
      {
        estado: EstadoTurno.CONFIRMADO,
        usuario: String(medicoPorNombre["Dr. Martin Sosa"]._id),
        motivoCambio: "Confirmacion del profesional",
        fechaHoraCambio: diasDesdeHoy(-2, 18, 0),
      },
    ],
  };

  const turnoCanceladoPaz = {
    medico: medicoPorNombre["Dra. Laura Paz"]._id,
    paciente: String(pacientePorNombre["Camila Nunez"]._id),
    fechaHora: diasDesdeHoy(5, 15, 0),
    sede: sedePorNombre["Sede Avellaneda"]._id,
    servicio: prestacionPorNombre("Traumatologia")._id,
    costo: prestacionPorNombre("Traumatologia").costo,
    estado: EstadoTurno.CANCELADO,
    disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dra. Laura Paz"], 0),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-5, 8, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(pacientePorNombre["Camila Nunez"]._id),
        motivoCambio: "Reserva del paciente",
        fechaHoraCambio: diasDesdeHoy(-4, 12, 0),
      },
      {
        estado: EstadoTurno.CANCELADO,
        usuario: String(pacientePorNombre["Camila Nunez"]._id),
        motivoCambio: "Cancelacion por viaje",
        fechaHoraCambio: diasDesdeHoy(-3, 9, 0),
      },
    ],
  };

  const turnoRealizadoAna = {
    medico: medicoPorNombre["Dra. Ana Rivas"]._id,
    paciente: String(pacientePorNombre["Diego Rojas"]._id),
    fechaHora: diasDesdeHoy(-7, 8, 30),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Laboratorio")._id,
    costo: prestacionPorNombre("Laboratorio").costo,
    estado: EstadoTurno.REALIZADO,
    disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dra. Ana Rivas"], 2),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-10, 8, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(pacientePorNombre["Diego Rojas"]._id),
        motivoCambio: "Reserva del paciente",
        fechaHoraCambio: diasDesdeHoy(-9, 13, 0),
      },
      {
        estado: EstadoTurno.CONFIRMADO,
        usuario: String(medicoPorNombre["Dra. Ana Rivas"]._id),
        motivoCambio: "Confirmacion del profesional",
        fechaHoraCambio: diasDesdeHoy(-8, 16, 0),
      },
      {
        estado: EstadoTurno.REALIZADO,
        usuario: String(medicoPorNombre["Dra. Ana Rivas"]._id),
        motivoCambio: "Atencion realizada",
        fechaHoraCambio: diasDesdeHoy(-7, 9, 0),
      },
    ],
  };

  const turnoDisponibleCambio = {
    medico: medicoPorNombre["Dr. Martin Sosa"]._id,
    fechaHora: diasDesdeHoy(6, 10, 30),
    sede: sedePorNombre["Sede Belgrano"]._id,
    servicio: prestacionPorNombre("Pediatria")._id,
    costo: prestacionPorNombre("Pediatria").costo,
    estado: EstadoTurno.DISPONIBLE,
    disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dr. Martin Sosa"], 0),
    historialEstados: historial(
      EstadoTurno.DISPONIBLE,
      "SYSTEM",
      "Turno disponible para probar solicitud de cambio",
    ),
  };

  const turnosBase = [
    turnoDisponibleAna,
    turnoReservadoAna,
    turnoConfirmadoSosa,
    turnoCanceladoPaz,
    turnoRealizadoAna,
    turnoDisponibleCambio,
    {
      medico: medicoPorNombre["Dra. Laura Paz"]._id,
      fechaHora: diasDesdeHoy(7, 9, 0),
      sede: sedePorNombre["Sede Palermo"]._id,
      servicio: prestacionPorNombre("Ecografia")._id,
      costo: prestacionPorNombre("Ecografia").costo,
      estado: EstadoTurno.DISPONIBLE,
      disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dra. Laura Paz"], 1),
      historialEstados: historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
      ),
    },
    {
      medico: medicoPorNombre["Dra. Laura Paz"]._id,
      fechaHora: diasDesdeHoy(8, 13, 0),
      sede: sedePorNombre["Sede Avellaneda"]._id,
      servicio: prestacionPorNombre("Resonancia Magnetica")._id,
      costo: prestacionPorNombre("Resonancia Magnetica").costo,
      estado: EstadoTurno.DISPONIBLE,
      disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dra. Laura Paz"], 2),
      historialEstados: historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
      ),
    },
    {
      medico: medicoPorNombre["Dr. Martin Sosa"]._id,
      fechaHora: diasDesdeHoy(9, 9, 0),
      sede: sedePorNombre["Sede Belgrano"]._id,
      servicio: prestacionPorNombre("Vacunacion")._id,
      costo: prestacionPorNombre("Vacunacion").costo,
      estado: EstadoTurno.DISPONIBLE,
      disponibilidadOrigen: obtenerDisponibilidad(medicoPorNombre["Dr. Martin Sosa"], 2),
      historialEstados: historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
      ),
    },
  ];

  const turnosDisponiblesGenerados = generarTurnosDisponibles({
    medicos,
    prestaciones,
    turnosBase,
  });

  const turnos = await TurnoModel.insertMany([
    ...turnosBase,
    ...turnosDisponiblesGenerados,
  ]);

  await Promise.all(
    medicos.map((medico) => {
      const turnosDelMedico = turnos
        .filter((turno) => String(turno.medico) === String(medico._id))
        .map((turno) => turno._id);

      return MedicoModel.updateOne(
        { _id: medico._id },
        { $set: { turnos: turnosDelMedico } },
      );
    }),
  );

  await SolicitudCambioTurnoModel.insertMany([
    {
      turnoOriginal: turnos[2]._id,
      turnoNuevo: turnos[5]._id,
      solicitanteId: String(pacientePorNombre["Sofia Gomez"]._id),
      pacienteId: String(pacientePorNombre["Sofia Gomez"]._id),
      medicoId: String(medicoPorNombre["Dr. Martin Sosa"]._id),
      motivo: "Necesita reprogramar por superposicion laboral",
      estado: EstadoSolicitudCambioTurno.PENDIENTE,
      fechaSolicitud: diasDesdeHoy(-1, 10, 0),
    },
    {
      turnoOriginal: turnos[1]._id,
      turnoNuevo: turnos[0]._id,
      solicitanteId: String(pacientePorNombre["Juan Perez"]._id),
      pacienteId: String(pacientePorNombre["Juan Perez"]._id),
      medicoId: String(medicoPorNombre["Dra. Ana Rivas"]._id),
      confirmadorId: String(medicoPorNombre["Dra. Ana Rivas"]._id),
      motivo: "El paciente solicito adelantar el turno",
      motivoRechazo: "El turno propuesto queda reservado para urgencias",
      estado: EstadoSolicitudCambioTurno.RECHAZADA,
      fechaSolicitud: diasDesdeHoy(-4, 10, 0),
      fechaResolucion: diasDesdeHoy(-3, 10, 0),
    },
  ]);

  await NotificacionModel.insertMany([
    {
      destinatario: medicoPorNombre["Dra. Ana Rivas"]._id,
      remitente: pacientePorNombre["Juan Perez"]._id,
      mensaje: "Juan Perez reservo un turno de Cardiologia.",
      leida: false,
      fechaHoraCreacion: diasDesdeHoy(-1, 11, 30),
    },
    {
      destinatario: pacientePorNombre["Sofia Gomez"]._id,
      remitente: medicoPorNombre["Dr. Martin Sosa"]._id,
      mensaje: "Tu turno de Pediatria fue confirmado.",
      leida: true,
      fechaHoraCreacion: diasDesdeHoy(-2, 18, 0),
      fechaHoraLeida: diasDesdeHoy(-2, 18, 15),
    },
    {
      destinatario: medicoPorNombre["Dr. Martin Sosa"]._id,
      remitente: pacientePorNombre["Sofia Gomez"]._id,
      mensaje: "Sofia Gomez solicito cambiar su turno de Pediatria.",
      leida: false,
      fechaHoraCreacion: diasDesdeHoy(-1, 10, 0),
    },
    {
      destinatario: pacientePorNombre["Camila Nunez"]._id,
      remitente: medicoPorNombre["Dra. Laura Paz"]._id,
      mensaje: "Se registro la cancelacion de tu turno de Traumatologia.",
      leida: true,
      fechaHoraCreacion: diasDesdeHoy(-3, 9, 0),
      fechaHoraLeida: diasDesdeHoy(-3, 9, 10),
    },
  ]);

  console.log("Seed completa creada correctamente");
  console.log(`Servicios: ${servicios.length}`);
  console.log(`Prestaciones: ${prestaciones.length}`);
  console.log(`Sedes: ${sedes.length}`);
  console.log(`Obras sociales: ${obrasSociales.length}`);
  console.log(`Planes: ${planes.length}`);
  console.log(`Medicos: ${medicos.length}`);
  console.log(`Pacientes: ${pacientes.length}`);
  console.log(`Turnos: ${turnos.length}`);
} catch (error) {
  console.error("Error al ejecutar la seed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.connection.close();
}
