/**
 * Test de integración — capa de controladores (GET /turnos)
 * Usamos supertest contra la app de Express real (controller -> service -> repository -> Mongo en memoria).
 * El middleware de autenticación se mockea como pass-through: getTurnos no depende de req.user.
 */
import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

import { PacienteModel } from "../../../src/schemas/paciente.schema.js";
import { MedicoModel } from "../../../src/schemas/medico.schema.js";
import { SedeModel } from "../../../src/schemas/sede.schema.js";
import { PrestacionModel } from "../../../src/schemas/prestacion.schema.js";
import { TurnoModel } from "../../../src/schemas/turno.schema.js";

jest.unstable_mockModule("../../../src/middlewares/auth.middleware.js", () => ({
  verifyToken: (req, res, next) => next(),
  requiereRol: () => (req, res, next) => next(),
}));

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  ({ default: app } = await import("../../../src/app.js"));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe("GET /turnos?pacienteId= — integración de la capa de controladores", () => {
  test("devuelve únicamente los turnos del paciente solicitado", async () => {
    const pacienteA = await PacienteModel.create({
      usuario: "usuario-a",
      dni: "11111111",
      nombre: "Paciente A",
    });
    const pacienteB = await PacienteModel.create({
      usuario: "usuario-b",
      dni: "22222222",
      nombre: "Paciente B",
    });

    const medico = await MedicoModel.create({
      usuario: "usuario-medico",
      matricula: "MP-1000",
      nombre: "Dr. House",
    });
    const sede = await SedeModel.create({
      nombre: "Sede Central",
      direccion: "Calle Falsa 123",
    });
    const prestacion = await PrestacionModel.create({
      servicioUnico: new mongoose.Types.ObjectId(),
      duracionTurnoEnMins: 30,
      costo: 1000,
    });

    const disponibilidadOrigen = {
      diaSemana: "LUNES",
      horaDesde: "09:00",
      horaHasta: "13:00",
      sede: sede._id,
      prestacion: prestacion._id,
    };

    const buildTurno = (pacienteId, fechaHora) => ({
      paciente: pacienteId,
      medico: medico._id,
      servicio: prestacion._id,
      sede: sede._id,
      fechaHora,
      disponibilidadOrigen,
    });

    const turnosPacienteA = await TurnoModel.insertMany([
      buildTurno(pacienteA._id.toString(), new Date("2026-09-15T10:00:00Z")),
      buildTurno(pacienteA._id.toString(), new Date("2026-09-16T10:00:00Z")),
    ]);
    await TurnoModel.insertMany([
      buildTurno(pacienteB._id.toString(), new Date("2026-09-17T10:00:00Z")),
    ]);

    const response = await request(app)
      .get("/turnos")
      .query({ pacienteId: pacienteA._id.toString() });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveLength(2);

    const idsDevueltos = response.body.data.map((turno) => turno.id).sort();
    const idsEsperados = turnosPacienteA.map((turno) => turno._id.toString()).sort();
    expect(idsDevueltos).toEqual(idsEsperados);
  });
});