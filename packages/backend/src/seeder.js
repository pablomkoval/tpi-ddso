//import mongoose from "mongoose";
import { DateTime } from "luxon";
import { MongoDBClient } from "./config/database.js";
import { DiaSemana } from "./domain/enum/DiaSemana.js";
import { EstadoSolicitudCambioTurno } from "./domain/enum/EstadoSolicitudCambioTurno.js";
import { EstadoTurno } from "./domain/enum/EstadoTurno.js";
import { NivelCobertura } from "./domain/enum/NivelCobertura.js";
import { TipoServicio } from "./domain/enum/TipoServicio.js";
import { ServicioModel } from "./schemas/servicio.schema.js";
import { ObraSocialModel } from "./schemas/obraSocial.schema.js";
import { PacienteModel } from "./schemas/paciente.schema.js";
import { PlanModel } from "./schemas/plan.schema.js";
import { SedeModel } from "./schemas/sede.schema.js";
import { MedicoModel } from "./schemas/medico.schema.js";
import { TurnoModel } from "./schemas/turno.schema.js";
import { PrestacionModel } from "./schemas/prestacion.schema.js";
import { EspecialidadModel } from "./schemas/especialidad.schema.js";
import { UsuarioModel } from "./schemas/usuario.schema.js";
import { SolicitudCambioTurnoModel } from "./schemas/solicitudCambioTurno.schema.js";
import { NotificacionModel } from "./schemas/notificacion.schema.js";
import { KeycloakService } from "./services/keycloak.service.js";
import { ZONA_HORARIA_ARGENTINA } from "./shared/timezone.js";

const SEED_PASSWORD = "1234";
const keycloakService = new KeycloakService();

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
  UsuarioModel,
];

const diasDesdeHoy = (dias, hora, minutos = 0) =>
  DateTime.now()
    .setZone(ZONA_HORARIA_ARGENTINA)
    .plus({ days: dias })
    .set({ hour: hora, minute: minutos, second: 0, millisecond: 0 })
    .toJSDate();

const historial = (estado, usuario, motivoCambio, fechaHoraCambio = new Date()) => [
  {
    estado,
    usuario,
    motivoCambio,
    fechaHoraCambio,
  },
];

const crearUsuarioParaSeed = async ({ username, nombre, role }) => {
  const kcUser = await keycloakService.createUser({ username, password: SEED_PASSWORD, nombre });
  await keycloakService.assignRole(kcUser.id, role);
  return UsuarioModel.create({ username, keycloakId: kcUser.id });
};

const obtenerDisponibilidad = (medico, indice) =>
  medico.disponibilidades[indice].toObject();

const minutosDesdeHora = (hora) => {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
};

const crearFechaParaDiaYMinutos = (diaSemana, semana, minutosDelDia) => {
  const ahora = DateTime.now().setZone(ZONA_HORARIA_ARGENTINA);
  const diaSemanaJs = ahora.weekday % 7; // Luxon: lunes=1..domingo=7 -> domingo=0..sabado=6
  const diasHastaTurno = (Number(diaSemana) - diaSemanaJs + 7) % 7;
  return ahora
    .plus({ days: diasHastaTurno + semana * 7 })
    .set({
      hour: Math.floor(minutosDelDia / 60),
      minute: minutosDelDia % 60,
      second: 0,
      millisecond: 0,
    })
    .toJSDate();
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

  console.log("Limpiando la base de datos...");
  await Promise.all(coleccionesAReiniciar.map((modelo) => modelo.deleteMany({})));
  console.log("Base de datos limpia.");

  console.log("Limpiando usuarios de Keycloak...");
  await keycloakService.deleteAllUsers();
  console.log("Usuarios de Keycloak eliminados.");

  // 1. Crear Servicios (catalogo)
  const servicios = await ServicioModel.insertMany([
    { nombre: "Clinica Medica", tipoServicio: TipoServicio.ESPECIALIDAD },
  ]);
  console.log(`${servicios.length} servicios creados.`);

  const servicioPorNombre = Object.fromEntries(
    servicios.map((servicio) => [servicio.nombre, servicio]),
  );

  // 2. Crear Prestaciones (Especialidades y Practicas) ligadas a cada servicio
  const especialidades = await EspecialidadModel.insertMany([
    { servicioUnico: servicioPorNombre["Clinica Medica"]._id, duracionTurnoEnMins: 20, costo: 3000 },
  ]);

  const prestaciones = [...especialidades];
  console.log(`${prestaciones.length} prestaciones creadas.`);

  const prestacionPorNombre = (nombreServicio) => {
    const servicio = servicioPorNombre[nombreServicio];
    return prestaciones.find(
      (prestacion) => String(prestacion.servicioUnico) === String(servicio._id),
    );
  };

  // 3. Crear Sedes
  const sedes = await SedeModel.insertMany([
    { nombre: "Sede Centro", direccion: "Av. Corrientes 1234, CABA" },
  ]);
  console.log(`${sedes.length} sedes creadas.`);

  const sedePorNombre = Object.fromEntries(
    sedes.map((sede) => [sede.nombre, sede]),
  );

  // 4. Crear Planes de cobertura
  const planes = await PlanModel.insertMany([
    {
      nombre: "OSDE 210",
      coberturasEspecialidad: [
        { prestacion: prestacionPorNombre("Clinica Medica")._id, nivel: NivelCobertura.TOTAL },
      ],
      coberturasPractica: [],
    },
  ]);
  console.log(`${planes.length} planes creados.`);

  const planPorNombre = Object.fromEntries(
    planes.map((plan) => [plan.nombre, plan]),
  );

  const obrasSociales = await ObraSocialModel.insertMany([
    {
      nombre: "OSDE",
      planes: [planPorNombre["OSDE 210"]._id],
    },
  ]);

  const obraSocialPorNombre = Object.fromEntries(
    obrasSociales.map((obraSocial) => [obraSocial.nombre, obraSocial]),
  );

  const medicosData = [
    {
      username: "medico@mail.com",
      matricula: "MN-100000",
      nombre: "Dr. Juan Medico",
      especialidades: [prestacionPorNombre("Clinica Medica")._id],
      practicas: [],
      sedes: [sedePorNombre["Sede Centro"]._id],
      disponibilidades: [
        DiaSemana.LUNES,
        DiaSemana.MARTES,
        DiaSemana.MIERCOLES,
        DiaSemana.JUEVES,
        DiaSemana.VIERNES,
      ].map((diaSemana) => ({
        diaSemana,
        horaDesde: "09:00",
        horaHasta: "11:00",
        sede: sedePorNombre["Sede Centro"]._id,
        prestacion: prestacionPorNombre("Clinica Medica")._id,
      })),
    },
  ];

  console.log("Creando usuario de medico en Keycloak...");
  const medicos = [];
  for (const { username, ...datosMedico } of medicosData) {
    const usuario = await crearUsuarioParaSeed({
      username,
      nombre: datosMedico.nombre,
      role: "medico",
    });
    const medico = await MedicoModel.create({ ...datosMedico, usuario: String(usuario._id) });
    medicos.push(medico);
  }
  console.log(`${medicos.length} medico creado (Keycloak + Mongo).`);

  const medico = medicos[0];

  const pacientesData = [
    {
      username: "paciente@mail.com",
      dni: "30111222",
      nombre: "Juan Paciente",
      obraSocial: obraSocialPorNombre.OSDE._id,
      plan: planPorNombre["OSDE 210"]._id,
    },
  ];

  console.log("Creando usuario de paciente en Keycloak...");
  const pacientes = [];
  for (const { username, ...datosPaciente } of pacientesData) {
    const usuario = await crearUsuarioParaSeed({
      username,
      nombre: datosPaciente.nombre,
      role: "paciente",
    });
    const paciente = await PacienteModel.create({ ...datosPaciente, usuario: String(usuario._id) });
    pacientes.push(paciente);
  }
  console.log(`${pacientes.length} paciente creado (Keycloak + Mongo).`);

  const paciente = pacientes[0];

  const turnoDisponible = {
    medico: medico._id,
    fechaHora: diasDesdeHoy(2, 9, 0),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Clinica Medica")._id,
    costo: prestacionPorNombre("Clinica Medica").costo,
    estado: EstadoTurno.DISPONIBLE,
    disponibilidadOrigen: obtenerDisponibilidad(medico, 0),
    historialEstados: historial(
      EstadoTurno.DISPONIBLE,
      "SYSTEM",
      "Turno disponible generado por seed",
    ),
  };

  const turnoReservado = {
    medico: medico._id,
    paciente: String(paciente._id),
    fechaHora: diasDesdeHoy(3, 9, 0),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Clinica Medica")._id,
    costo: prestacionPorNombre("Clinica Medica").costo,
    estado: EstadoTurno.RESERVADO,
    disponibilidadOrigen: obtenerDisponibilidad(medico, 1),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-2, 9, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(paciente._id),
        motivoCambio: "Reserva inicial para probar flujo paciente",
        fechaHoraCambio: diasDesdeHoy(-1, 11, 30),
      },
    ],
  };

  const turnoConfirmado = {
    medico: medico._id,
    paciente: String(paciente._id),
    fechaHora: diasDesdeHoy(4, 9, 0),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Clinica Medica")._id,
    costo: prestacionPorNombre("Clinica Medica").costo,
    estado: EstadoTurno.CONFIRMADO,
    disponibilidadOrigen: obtenerDisponibilidad(medico, 2),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-4, 9, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(paciente._id),
        motivoCambio: "Reserva del paciente",
        fechaHoraCambio: diasDesdeHoy(-3, 15, 0),
      },
      {
        estado: EstadoTurno.CONFIRMADO,
        usuario: String(medico._id),
        motivoCambio: "Confirmacion del profesional",
        fechaHoraCambio: diasDesdeHoy(-2, 18, 0),
      },
    ],
  };

  const turnoCancelado = {
    medico: medico._id,
    paciente: String(paciente._id),
    fechaHora: diasDesdeHoy(5, 9, 0),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Clinica Medica")._id,
    costo: prestacionPorNombre("Clinica Medica").costo,
    estado: EstadoTurno.CANCELADO,
    disponibilidadOrigen: obtenerDisponibilidad(medico, 3),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-5, 8, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(paciente._id),
        motivoCambio: "Reserva del paciente",
        fechaHoraCambio: diasDesdeHoy(-4, 12, 0),
      },
      {
        estado: EstadoTurno.CANCELADO,
        usuario: String(paciente._id),
        motivoCambio: "Cancelacion por viaje",
        fechaHoraCambio: diasDesdeHoy(-3, 9, 0),
      },
    ],
  };

  const turnoRealizado = {
    medico: medico._id,
    paciente: String(paciente._id),
    fechaHora: diasDesdeHoy(-7, 9, 0),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Clinica Medica")._id,
    costo: prestacionPorNombre("Clinica Medica").costo,
    estado: EstadoTurno.REALIZADO,
    disponibilidadOrigen: obtenerDisponibilidad(medico, 4),
    historialEstados: [
      ...historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
        diasDesdeHoy(-10, 8, 0),
      ),
      {
        estado: EstadoTurno.RESERVADO,
        usuario: String(paciente._id),
        motivoCambio: "Reserva del paciente",
        fechaHoraCambio: diasDesdeHoy(-9, 13, 0),
      },
      {
        estado: EstadoTurno.CONFIRMADO,
        usuario: String(medico._id),
        motivoCambio: "Confirmacion del profesional",
        fechaHoraCambio: diasDesdeHoy(-8, 16, 0),
      },
      {
        estado: EstadoTurno.REALIZADO,
        usuario: String(medico._id),
        motivoCambio: "Atencion realizada",
        fechaHoraCambio: diasDesdeHoy(-7, 9, 0),
      },
    ],
  };

  const turnoDisponibleCambio = {
    medico: medico._id,
    fechaHora: diasDesdeHoy(6, 9, 0),
    sede: sedePorNombre["Sede Centro"]._id,
    servicio: prestacionPorNombre("Clinica Medica")._id,
    costo: prestacionPorNombre("Clinica Medica").costo,
    estado: EstadoTurno.DISPONIBLE,
    disponibilidadOrigen: obtenerDisponibilidad(medico, 0),
    historialEstados: historial(
      EstadoTurno.DISPONIBLE,
      "SYSTEM",
      "Turno disponible para probar solicitud de cambio",
    ),
  };

  const turnosBase = [
    turnoDisponible,
    turnoReservado,
    turnoConfirmado,
    turnoCancelado,
    turnoRealizado,
    turnoDisponibleCambio,
    {
      medico: medico._id,
      fechaHora: diasDesdeHoy(7, 9, 0),
      sede: sedePorNombre["Sede Centro"]._id,
      servicio: prestacionPorNombre("Clinica Medica")._id,
      costo: prestacionPorNombre("Clinica Medica").costo,
      estado: EstadoTurno.DISPONIBLE,
      disponibilidadOrigen: obtenerDisponibilidad(medico, 1),
      historialEstados: historial(
        EstadoTurno.DISPONIBLE,
        "SYSTEM",
        "Turno disponible generado por seed",
      ),
    },
    {
      medico: medico._id,
      fechaHora: diasDesdeHoy(8, 9, 0),
      sede: sedePorNombre["Sede Centro"]._id,
      servicio: prestacionPorNombre("Clinica Medica")._id,
      costo: prestacionPorNombre("Clinica Medica").costo,
      estado: EstadoTurno.DISPONIBLE,
      disponibilidadOrigen: obtenerDisponibilidad(medico, 2),
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
      solicitanteId: String(paciente._id),
      pacienteId: String(paciente._id),
      medicoId: String(medico._id),
      motivo: "Necesita reprogramar por superposicion laboral",
      estado: EstadoSolicitudCambioTurno.PENDIENTE,
      fechaSolicitud: diasDesdeHoy(-1, 10, 0),
    },
    {
      turnoOriginal: turnos[1]._id,
      turnoNuevo: turnos[0]._id,
      solicitanteId: String(paciente._id),
      pacienteId: String(paciente._id),
      medicoId: String(medico._id),
      confirmadorId: String(medico._id),
      motivo: "El paciente solicito adelantar el turno",
      motivoRechazo: "El turno propuesto queda reservado para urgencias",
      estado: EstadoSolicitudCambioTurno.RECHAZADA,
      fechaSolicitud: diasDesdeHoy(-4, 10, 0),
      fechaResolucion: diasDesdeHoy(-3, 10, 0),
    },
  ]);

  await NotificacionModel.insertMany([
    {
      destinatario: medico._id,
      remitente: paciente._id,
      mensaje: "Juan Paciente reservo un turno de Clinica Medica.",
      leida: false,
      fechaHoraCreacion: diasDesdeHoy(-1, 11, 30),
    },
    {
      destinatario: paciente._id,
      remitente: medico._id,
      mensaje: "Tu turno de Clinica Medica fue confirmado.",
      leida: true,
      fechaHoraCreacion: diasDesdeHoy(-2, 18, 0),
      fechaHoraLeida: diasDesdeHoy(-2, 18, 15),
    },
    {
      destinatario: medico._id,
      remitente: paciente._id,
      mensaje: "Juan Paciente solicito cambiar su turno de Clinica Medica.",
      leida: false,
      fechaHoraCreacion: diasDesdeHoy(-1, 10, 0),
    },
    {
      destinatario: paciente._id,
      remitente: medico._id,
      mensaje: "Se registro la cancelacion de tu turno de Clinica Medica.",
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
  console.log(`Usuarios creados en Keycloak + Mongo: ${medicos.length + pacientes.length} (password: "${SEED_PASSWORD}")`);
  process.exit(0);
} catch (error) {
    console.error("Error al ejecutar el seeder:", error);
    process.exit(1);
}
