// packages/backend/tests/services/medico/MedicoService.test.js
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
// 🚀 Corregido: Nombre de archivo real y ruta exacta
import { MedicoService } from "../../../src/services/medico.service.js";

describe("Servicios Médico", () => {
    let servicio;
    let medicoRepositoryMock;
    let servicioServiceMock;
    let usuarioRepositoryMock;
    let turnoRepositoryMock;

    beforeEach(() => {
        const medicos = [];

        medicoRepositoryMock = {
            findAll: jest.fn().mockImplementation(
                () => Promise.resolve(medicos)
            ),
            findById: jest.fn().mockImplementation(
                (id) => Promise.resolve(medicos.find(m => m.id === id))
            ),
            save: jest.fn().mockImplementation(
                (medico) => {
                    medico.id = medicos.length + 1;
                    medicos.push(medico);
                    return Promise.resolve(medico);
                }
            ),
            update: jest.fn().mockImplementation(
                (id, data) => Promise.resolve({ id, ...data })
            ),
        };

        servicioServiceMock = {};
        usuarioRepositoryMock = {};
        turnoRepositoryMock = {};

        servicio = new MedicoService(
            medicoRepositoryMock,
            servicioServiceMock,
            usuarioRepositoryMock,
            turnoRepositoryMock
        );
    });

    describe("Creación de un médico", () => {
        test("Debería crear un médico con los datos proporcionados", async () => {

            const sede = { id: "sede1", nombre: "Sede Medrano", direccion: "Direccion" };

            const medicoDTO = {
                usuario: "usuario1",
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [sede]
            };

            const medicoCreado = await servicio.create(medicoDTO);

            expect(medicoCreado).toMatchObject({
                usuario: medicoDTO.usuario,
                matricula: medicoDTO.matricula,
                nombre: medicoDTO.nombre,
                especialidades: medicoDTO.especialidades,
                practicas: medicoDTO.practicas,
                sedes: medicoDTO.sedes
            });
        });
    });

    describe("Obtención de todos los médicos", () => {
        test("Debería retornar una lista de médicos", async () => {
            const sede1 = { id: "sede1", nombre: "Sede Medrano", direccion: "Direccion Medrano" };
            const sede2 = { id: "sede2", nombre: "Sede Lugano", direccion: "Direccion Lugano" };

            const medicoDTO1 = {
                usuario: "usuario1",
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [sede1]
            };
            const medicoDTO2 = {
                usuario: "usuario2",
                matricula: "67890",
                nombre: "Dra. María Gómez",
                especialidades: [],
                practicas: [],
                sedes: [sede2]
            };

            await servicio.create(medicoDTO1);
            await servicio.create(medicoDTO2);

            const medicos = await servicio.findAll();
            expect(medicos.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Obtención de un médico por ID", () => {
        test("Debería retornar el médico correspondiente al ID proporcionado", async () => {

            const sede2 = { id: "sede2", nombre: "Sede Lugano", direccion: "Direccion Lugano" };
            const medicoDTO = {
                usuario: "usuario2",
                matricula: "67890",
                nombre: "Dra. María Gómez",
                especialidades: [],
                practicas: [],
                sedes: [sede2]
            };

            const medicoCreado = await servicio.create(medicoDTO);
            const medicoObtenido = await servicio.findById(medicoCreado.id);

            expect(medicoObtenido).toMatchObject({
                id: medicoCreado.id,
                usuario: medicoDTO.usuario,
                matricula: medicoDTO.matricula,
                nombre: medicoDTO.nombre,
                sedes: medicoDTO.sedes
            });
        });
    });
});