import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { MedicoService } from "../../../src/services/medico.service.js";
import { DiaSemana } from "../../../src/domain/enum/DiaSemana.js";

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
                    if (!medico.id) {
                        medico.id = medicos.length + 1;
                    }
                    if (!medico.disponibilidades) medico.disponibilidades = [];

                    const index = medicos.findIndex(m => m.id === medico.id);
                    if (index >= 0) {
                        medicos[index] = medico;
                    } else {
                        medicos.push(medico);
                    }
                    return Promise.resolve(medico);
                }
            ),
            update: jest.fn().mockImplementation(
                (id, data) => {
                    const medico = medicos.find(m => m.id === id);
                    if (medico) {
                        Object.assign(medico, data);
                        return Promise.resolve(medico);
                    }
                    return Promise.resolve({ id, ...data });
                }
            ),
        };

        servicioServiceMock = {};
        usuarioRepositoryMock = {};
        turnoRepositoryMock = {
            findAllByDisponibilidad: jest.fn().mockResolvedValue([]),
            actualizarTurnosDisponibles: jest.fn().mockResolvedValue([])
        };

        servicio = new MedicoService(
            medicoRepositoryMock,
            servicioServiceMock,
            usuarioRepositoryMock,
            turnoRepositoryMock
        );

        servicio.turnoService = turnoRepositoryMock;
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

    describe("Obtención de disponibilidades de un médico", () => {
        test("Debería retornar las disponibilidades del médico correspondiente al ID proporcionado", async () => {
            const sede1 = { id: "sede1", nombre: "Sede Central", direccion: "Calle Principal 123" };
            const medicoDTO = {
                usuario: "medico1",
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [sede1]
            };

            const medicoCreado = await servicio.create(medicoDTO);

            medicoCreado.disponibilidades = [{
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede1
            }];

            const disponibilidades = await servicio.obtenerDisponibilidades(medicoCreado.id);

            const normalizadas = disponibilidades.map(d => ({
                diaSemana: d.diaSemana,
                horaDesde: d.horaDesde,
                horaHasta: d.horaHasta,
                sede: d.sede
            }));

            expect(normalizadas).toEqual([{
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede1
            }]);
        });
    });

    describe("Edición de una disponibilidad de un médico", () => {
        test("Debería actualizar la disponibilidad del médico correspondiente al ID proporcionado", async () => {
            const lSede = { id: "sede1", nombre: "Sede Central", direccion: "Calle Principal 123" };
            const medicoDTO = {
                usuario: "medico1",
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [lSede]
            };

            const medicoCreado = await servicio.create(medicoDTO);

            const medicoMockVivo = {
                ...medicoCreado,
                disponibilidades: [{
                    _id: "disp1",
                    diaSemana: DiaSemana.LUNES,
                    horaDesde: "09:00",
                    horaHasta: "17:00",
                    sede: lSede
                }],
                editarDisponibilidad: function (id, cambios) {
                    const d = this.disponibilidades.find(disp => disp._id === id);
                    if (d) Object.assign(d, cambios);
                },
                quitarTurno: jest.fn(),
                save: function () { return Promise.resolve(this); }
            };

            medicoRepositoryMock.findById.mockResolvedValue(medicoMockVivo);

            const nuevaDisponibilidad = {
                diaSemana: DiaSemana.MARTES,
                horaDesde: "10:00",
                horaHasta: "18:00",
                sede: lSede
            };

            const medicoActualizado = await servicio.editarDisponibilidad(medicoCreado.id, "disp1", nuevaDisponibilidad);

            const normalizadas = medicoActualizado.disponibilidades.map(d => ({
                diaSemana: d.diaSemana,
                horaDesde: d.horaDesde,
                horaHasta: d.horaHasta,
                sede: d.sede
            }));

            expect(normalizadas).toEqual([{
                diaSemana: DiaSemana.MARTES,
                horaDesde: "10:00",
                horaHasta: "18:00",
                sede: lSede
            }]);
        });
    });
});