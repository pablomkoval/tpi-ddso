import { describe, test, expect, beforeEach, afterAll, jest } from "@jest/globals";
import mongoose from "mongoose";
import { MedicoService } from "../../../src/services/medico.service.js";
import { MedicoModel } from "../../../src/schemas/medico.schema.js";
import { DiaSemana } from "../../../src/domain/enum/DiaSemana.js";

describe("Servicios Médico", () => {
    let servicio;
    let medicoRepositoryMock;
    let usuarioRepositoryMock;

    beforeEach(() => {
        const medicos = [];
        medicoRepositoryMock = {
            findAll: jest.fn().mockImplementation(
                () => Promise.resolve(medicos)
            ),
            findById: jest.fn().mockImplementation(
                (id) => Promise.resolve(medicos.find(m => String(m.id) === String(id) || String(m._id) === String(id)))
            ),
            save: jest.fn().mockImplementation(
                (medico) => {
                    const mockDocumento = {
                        _id: String(medicos.length + 1),
                        id: medicos.length + 1,
                        usuario: medico.usuario,
                        matricula: medico.matricula,
                        nombre: medico.nombre,
                        especialidades: medico.especialidades || [],
                        practicas: medico.practicas || [],
                        sedes: medico.sedes || [],
                        disponibilidades: medico.disponibilidades?.length ? medico.disponibilidades : (medicos.length === 0 ? [
                            {
                                diaSemana: 1,
                                horaDesde: "09:00",
                                horaHasta: "17:00",
                                sede: { id: "sede1", nombre: "Sede Central", direccion: "Calle Principal 123" }
                            }
                        ] : []),
                        turnos: medico.turnos || []
                    };
                    medicos.push(mockDocumento);
                    return Promise.resolve(mockDocumento);
                }
            ),
            update: jest.fn().mockImplementation(
                (id, data) => {
                    const index = medicos.findIndex(m => String(m.id) === String(id));
                    if (index !== -1) {
                        medicos[index] = { ...medicos[index], ...data };
                        return Promise.resolve(medicos[index]);
                    }
                    return Promise.resolve({ id, ...data });
                }
            ),
            obtenerDisponibilidades: jest.fn().mockImplementation(
                (id) => {
                    const medico = medicos.find(m => String(m.id) === String(id));
                    return Promise.resolve(medico ? medico.disponibilidades : null);
                }
            )
        };

        usuarioRepositoryMock = {
            findOne: jest.fn().mockImplementation(
                (usuario) => Promise.resolve({ _id: "usuario1", ...usuario })
            )
        };

        servicio = new MedicoService(medicoRepositoryMock, null, usuarioRepositoryMock, null);
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
                sedes: medicoDTO.sedes
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
                sedes: medicoDTO.sedes
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
    });

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
    });
});

describe("Servicios Médico - Test de Integración", () => {
    let servicioIntegracion;

    beforeAll(async () => {
        const urlConexion = process.env.MONGO_URL_TEST || "mongodb://localhost:27017/sweet_medical_test";
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(urlConexion);
        }

        const medicoRepositoryReal = {
            save: async (medico) => {
                const nuevo = new MedicoModel(medico);
                return await nuevo.save();
            },
            findById: async (id) => {
                return await MedicoModel.findById(id);
            },
            findAll: async () => {
                return await MedicoModel.find();
            },
            update: async (id, data) => {
                return await MedicoModel.findByIdAndUpdate(id, data, { new: true });
            }
        };

        servicioIntegracion = new MedicoService(medicoRepositoryReal, null, null, null);
    });

    beforeEach(async () => {
        if (mongoose.connection.readyState !== 0) {
            await MedicoModel.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test("Debería persistir un médico, actualizar sus datos de negocio en MongoDB y verificar la consistencia", async () => {
        const idSedeReal = new mongoose.Types.ObjectId().toString();
        const idEsquemaEspecialidad = new mongoose.Types.ObjectId().toString();
        const medicoDTO = {
            usuario: new mongoose.Types.ObjectId().toString(),
            matricula: "77777",
            nombre: "Dr. Inicial Integrado",
            especialidades: [],
            practicas: [],
            sedes: [idSedeReal]
        };

        const medicoCreado = await servicioIntegracion.create(medicoDTO);
        expect(medicoCreado).toHaveProperty("_id");

        const datosActualizados = {
            nombre: "Dr. Nombre Modificado",
            especialidades: [idEsquemaEspecialidad]
        };

        await servicioIntegracion.update(medicoCreado._id, datosActualizados);

        const medicoModificadoEnBD = await servicioIntegracion.findById(medicoCreado._id);
        expect(medicoModificadoEnBD).toBeTruthy();
        expect(medicoModificadoEnBD.nombre).toBe("Dr. Nombre Modificado");
        expect(medicoModificadoEnBD.matricula).toBe("77777");
        expect(medicoModificadoEnBD.especialidades.map(e => String(e))).toContain(idEsquemaEspecialidad);

        const listadoTotal = await servicioIntegracion.findAll();
        expect(listadoTotal.length).toBe(1);
    });
});