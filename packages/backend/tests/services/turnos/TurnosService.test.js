/**
 * Tests de integración — TurnoRepository con MongoDB en memoria
 * Usamos `mongodb-memory-server` para levantar una instancia real de Mongo
 */
import { describe, test, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import "../../../src/schemas/prestacion.schema.js";
import "../../../src/schemas/medico.schema.js";
import { TurnoModel } from "../../../src/schemas/turno.schema.js";
import { TurnoRepository } from "../../../src/domain/models/repositories/turno.repository.js";

let mongod;
let repo;

const buildTurnoData = (overrides = {}) => ({
    medico: new mongoose.Types.ObjectId(),
    servicio: new mongoose.Types.ObjectId(),
    fechaHora: new Date("2026-09-15T10:00:00Z"),
    costo: 2500,
    estado: "DISPONIBLE",
    disponibilidadOrigen: {
        diaSemana: "LUNES",
        horaDesde: "09:00",
        horaHasta: "13:00",
        sede: new mongoose.Types.ObjectId(),
        prestacion: new mongoose.Types.ObjectId(),
    },
    ...overrides,
});

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri);

    repo = new TurnoRepository();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await TurnoModel.deleteMany({});
});

describe("TurnoRepository — integración con MongoDB en memoria", () => {


    test("save() persiste un turno y findById() lo recupera correctamente", async () => {
        const datos = buildTurnoData({ costo: 1800 });
        const turnoGuardado = await repo.save(datos);

        expect(turnoGuardado._id).toBeDefined();
        expect(turnoGuardado.estado).toBe("DISPONIBLE");

        const encontrado = await repo.findById(turnoGuardado._id);
        expect(encontrado).not.toBeNull();
        expect(encontrado.costo).toBe(1800);
    });


    test("saveAll() inserta múltiples turnos de una vez", async () => {
        const turnos = [
            buildTurnoData({ fechaHora: new Date("2026-09-15T08:00:00Z") }),
            buildTurnoData({ fechaHora: new Date("2026-09-15T09:00:00Z") }),
            buildTurnoData({ fechaHora: new Date("2026-09-15T10:00:00Z") }),
        ];

        const guardados = await repo.saveAll(turnos);
        expect(guardados).toHaveLength(3);

        const total = await TurnoModel.countDocuments();
        expect(total).toBe(3);
    });


    test("buscarDisponibles() devuelve sólo los turnos en estado DISPONIBLE", async () => {
        const servicioId = new mongoose.Types.ObjectId();

        await repo.saveAll([
            buildTurnoData({ servicio: servicioId, estado: "DISPONIBLE" }),
            buildTurnoData({ servicio: servicioId, estado: "RESERVADO" }),
        ]);

        const { turnos, total } = await repo.buscarDisponibles(
            { prestacion: servicioId },
            { skip: 0, limit: 10, sort: { fechaHora: 1 } }
        );

        expect(total).toBe(1);
        expect(turnos).toHaveLength(1);
        expect(turnos[0].estado).toBe("DISPONIBLE");
    });

    test("buscarDisponibles() filtra por medico correctamente", async () => {
        const medicoA = new mongoose.Types.ObjectId();
        const medicoB = new mongoose.Types.ObjectId();
        const servicio = new mongoose.Types.ObjectId();

        await repo.saveAll([
            buildTurnoData({ medico: medicoA, servicio }),
            buildTurnoData({ medico: medicoA, servicio }),
            buildTurnoData({ medico: medicoB, servicio }),
        ]);

        const { total } = await repo.buscarDisponibles(
            { medico: medicoA },
            { skip: 0, limit: 10, sort: { fechaHora: 1 } }
        );

        expect(total).toBe(2);
    });

    test("buscarDisponibles() filtra por rango de fechas", async () => {
        const servicio = new mongoose.Types.ObjectId();

        await repo.saveAll([
            buildTurnoData({ servicio, fechaHora: new Date("2026-08-01T08:00:00Z") }),
            buildTurnoData({ servicio, fechaHora: new Date("2026-09-10T08:00:00Z") }),
            buildTurnoData({ servicio, fechaHora: new Date("2026-09-20T08:00:00Z") }),
            buildTurnoData({ servicio, fechaHora: new Date("2026-10-05T08:00:00Z") }),
        ]);

        const { total } = await repo.buscarDisponibles(
            {
                fechaDesde: "2026-09-01",
                fechaHasta: "2026-09-30",
            },
            { skip: 0, limit: 10, sort: { fechaHora: 1 } }
        );

        expect(total).toBe(2);
    });

  
    test("findAllByDisponibilidad() retorna sólo los turnos de esa disponibilidad", async () => {
        const dispId = new mongoose.Types.ObjectId();
        const otroDispId = new mongoose.Types.ObjectId();

        await repo.saveAll([
            buildTurnoData({ disponibilidadOrigen: { ...buildTurnoData().disponibilidadOrigen, _id: dispId } }),
            buildTurnoData({ disponibilidadOrigen: { ...buildTurnoData().disponibilidadOrigen, _id: dispId } }),
            buildTurnoData({ disponibilidadOrigen: { ...buildTurnoData().disponibilidadOrigen, _id: otroDispId } }),
        ]);

        const encontrados = await repo.findAllByDisponibilidad(dispId);
        expect(encontrados).toHaveLength(2);
    });

    test("borrarTurnosPorDisponibilidad() elimina sólo los DISPONIBLES de esa disponibilidad", async () => {
        const dispId = new mongoose.Types.ObjectId();

        await repo.saveAll([
            buildTurnoData({ estado: "DISPONIBLE", disponibilidadOrigen: { ...buildTurnoData().disponibilidadOrigen, _id: dispId } }),
            buildTurnoData({ estado: "DISPONIBLE", disponibilidadOrigen: { ...buildTurnoData().disponibilidadOrigen, _id: dispId } }),
            buildTurnoData({ estado: "RESERVADO",  disponibilidadOrigen: { ...buildTurnoData().disponibilidadOrigen, _id: dispId } }),
        ]);

        await repo.borrarTurnosPorDisponibilidad(dispId);

        const restantes = await TurnoModel.find({ "disponibilidadOrigen._id": dispId });
        expect(restantes).toHaveLength(1);
        expect(restantes[0].estado).toBe("RESERVADO");
    });

    test("findByPaciente() retorna los turnos asociados a un paciente", async () => {
        const pacienteId = "usuario-keycloak-abc123";

        await repo.saveAll([
            buildTurnoData({ paciente: pacienteId, estado: "RESERVADO" }),
            buildTurnoData({ paciente: pacienteId, estado: "COMPLETADO" }),
            buildTurnoData({ paciente: "otro-paciente", estado: "RESERVADO" }),
        ]);

        const turnos = await repo.findByPaciente(pacienteId);
        expect(turnos).toHaveLength(2);
        turnos.forEach((t) => expect(t.paciente).toBe(pacienteId));
    });
});