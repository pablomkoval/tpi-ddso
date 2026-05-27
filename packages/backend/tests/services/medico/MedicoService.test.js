import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import MedicoService from "../../../src/services/MedicoService.js";
import { DiaSemana } from "../../../src/domain/enum/DiaSemana.js";

describe("Servicios Médico", () => {
    let servicio;
    let medicoRepositoryMock;

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
            obtenerDisponibilidades: jest.fn().mockImplementation(
                (id) => {
                    const medico = medicos.find(m => m.id === id);
                    return Promise.resolve(medico ? medico.disponibilidades : null);
                }
            )
        };

        servicio = new MedicoService({ medicoRepository: medicoRepositoryMock });
    });

    describe("Creación de un médico", () => {
        test("Debería crear un médico con los datos proporcionados", async () => {
            const sede = { id: "sede1", nombre: "Sede Central", direccion: "Calle Principal 123" }
            const medicoDTO = {
                usuario: { username: "medico1", password: "password123" },
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [sede],
                disponibilidades: [
                    {
                        diaSemana: DiaSemana.LUNES,
                        horaDesde: "09:00",
                        horaHasta: "17:00",
                        sede: sede
                    }
                ]
            };

            const medicoCreado = await servicio.create(medicoDTO);

            expect(medicoCreado).toMatchObject({
                usuario: medicoDTO.usuario,
                matricula: medicoDTO.matricula,
                nombre: medicoDTO.nombre,
                especialidades: medicoDTO.especialidades,
                practicas: medicoDTO.practicas,
                sedes: medicoDTO.sedes,
                disponibilidades: medicoDTO.disponibilidades
            });
        });
    });

    describe("Obtención de todos los médicos", () => {
        test("Debería retornar una lista de médicos", async () => {
            const sede1 = { id: "sede1", nombre: "Sede Central", direccion: "Calle Principal 123" }
            const sede2 = { id: "sede2", nombre: "Sede Norte", direccion: "Avenida Norte 456" }
            const medicoDTO1 = {
                usuario: { username: "medico1", password: "password123" },
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [sede1],
                disponibilidades: [
                    {
                        diaSemana: DiaSemana.LUNES,
                        horaDesde: "09:00",
                        horaHasta: "17:00",
                        sede: sede1
                    }
                ]
            };
            const medicoDTO2 = {
                usuario: { username: "medico2", password: "password456" },
                matricula: "67890",
                nombre: "Dra. María Gómez",
                especialidades: [],
                practicas: [],
                sedes: [sede2],
                disponibilidades: [
                    {
                        diaSemana: DiaSemana.MARTES,
                        horaDesde: "10:00",
                        horaHasta: "18:00",
                        sede: sede2
                    }
                ]
            };

            await servicio.create(medicoDTO1);
            await servicio.create(medicoDTO2);

            const medicos = await servicio.findAll();

            expect(medicos.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Obtención de un médico por ID", () => {
        test("Debería retornar el médico correspondiente al ID proporcionado", async () => {
            const sede2 = { id: "sede2", nombre: "Sede Norte", direccion: "Avenida Norte 456" }
            const medicoDTO = {
                usuario: { username: "medico2", password: "password456" },
                matricula: "67890",
                nombre: "Dra. María Gómez",
                especialidades: [],
                practicas: [],
                sedes: [sede2],
                disponibilidades: [
                    {
                        diaSemana: DiaSemana.MARTES,
                        horaDesde: "10:00",
                        horaHasta: "18:00",
                        sede: sede2
                    }
                ]
            };

            const medicoCreado = await servicio.create(medicoDTO);
            const medicoObtenido = await servicio.findById(medicoCreado.id);

            expect(medicoObtenido).toMatchObject({
                id: medicoCreado.id,
                usuario: medicoDTO.usuario,
                matricula: medicoDTO.matricula,
                nombre: medicoDTO.nombre,
                especialidades: medicoDTO.especialidades,
                practicas: medicoDTO.practicas,
                sedes: medicoDTO.sedes,
                disponibilidades: medicoDTO.disponibilidades
            });
        });
    });

    describe("Obtención de disponibilidades de un médico", () => {
        test("Debería retornar las disponibilidades del médico correspondiente al ID proporcionado", async () => {
            const sede1 = { id: "sede1", nombre: "Sede Central", direccion: "Calle Principal 123" }
            const medicoDTO = {
                usuario: { username: "medico1", password: "password123" },
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [sede1],
                disponibilidades: [
                    {
                        diaSemana: DiaSemana.LUNES,
                        horaDesde: "09:00",
                        horaHasta: "17:00",
                        sede: sede1
                    }
                ]
            };

            const medicoCreado = await servicio.create(medicoDTO);
            const disponibilidades = await servicio.obtenerDisponibilidades(medicoCreado.id);

            const normalizadas = disponibilidades.map(d => ({
                diaSemana: d.diaSemana,
                horaDesde: d.horaDesde,
                horaHasta: d.horaHasta,
                sede: d.sede
            }));

            expect(normalizadas).toEqual(medicoDTO.disponibilidades);
        });
    })

    describe("Edición de una disponibilidad de un médico", () => {
        test("Debería actualizar la disponibilidad del médico correspondiente al ID proporcionado", async () => {
            const sede1 = { id: "sede1", nombre: "Sede Central", direccion: "Calle Principal 123" }
            const medicoDTO = {
                usuario: { username: "medico1", password: "password123" },
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [sede1],
                disponibilidades: [
                    {
                        diaSemana: DiaSemana.LUNES,
                        horaDesde: "09:00",
                        horaHasta: "17:00",
                        sede: sede1
                    }
                ]
            };
            
            const medicoCreado = await servicio.create(medicoDTO);
            const nuevaDisponibilidad = {
                diaSemana: DiaSemana.MARTES,
                horaDesde: "10:00",
                horaHasta: "18:00",
                sede: sede1
            };
            const medicoActualizado = await servicio.update(medicoCreado.id, {
                disponibilidades: [nuevaDisponibilidad]
            });

            const normalizadas = medicoActualizado.disponibilidades.map(d => ({
                diaSemana: d.diaSemana,
                horaDesde: d.horaDesde,
                horaHasta: d.horaHasta,
                sede: d.sede
            }));

            expect(normalizadas).toEqual([nuevaDisponibilidad]);
        });
    })
});
