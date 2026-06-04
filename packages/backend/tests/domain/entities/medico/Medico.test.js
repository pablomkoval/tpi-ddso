import { describe, test, expect } from "@jest/globals";
import Medico from "../../../../src/domain/models/entities/medico/Medico";
import { DisponibilidadHoraria } from "../../../../src/domain/models/entities/medico/DisponibilidadHoraria";
import { Usuario } from "../../../../src/domain/models/entities/Usuario"
import { DiaSemana } from "../../../../src/domain/enum/DiaSemana.js";
import { Practica } from "../../../../src/domain/models/entities/medico/Practica.js";
import mongoose from "mongoose";


describe("Creación de un médico", () => {
    test("Debería crear un médico con los datos proporcionados", () => {

        const usuario = new Usuario("medico1", "password123");
        const sede = { id: "sede1", nombre: "Sede Central" };
        const medico = new Medico(
            usuario, // Usuario asociado al médico
            "12345", // Matrícula del médico
            "Dr. Juan Pérez", // Nombre del médico
            [], // Especialidades
            [], // Prácticas
            [sede], // Sedes
        )

        expect(medico.usuario).toBe(usuario);
        expect(medico.matricula).toBe("12345");
        expect(medico.nombre).toBe("Dr. Juan Pérez");
        expect(medico.especialidades).toEqual([]);
        expect(medico.practicas).toEqual([]);
        expect(medico.sedes).toEqual([sede]);
    })
})

describe("Agregar disponibilidad horaria a un médico", () => {
    test("Debería agregar una nueva disponibilidad horaria al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const sede = { id: "sede1", nombre: "Sede Central" };

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [sede]
        )

        const disponibilidad1 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: sede
        })

        const disponibilidad2 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.MARTES,
            horaDesde: "10:00",
            horaHasta: "16:00",
            sede: sede
        })

        medico.agregarDisponibilidades([disponibilidad1, disponibilidad2]);
        expect(medico.disponibilidades).toEqual([disponibilidad1, disponibilidad2]);
    })

    test("Debería lanzar un error si se agrega una disponibilidad que no corresponde a una sede autorizada para el médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const sede1 = { id: "sede1", nombre: "Sede Central" };
        const sede2 = { id: "sede2", nombre: "Sede Norte" };
        const disponibilidad1 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: sede1
        })
        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [sede1], // El médico solo tiene autorizada la sede1
        )

        medico.agregarDisponibilidades([disponibilidad1]);

        expect(medico.disponibilidades).toEqual([disponibilidad1]);

        const disponibilidad2 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.MARTES,
            horaDesde: "10:00",
            horaHasta: "16:00",
            sede: sede2 // La sede2 no está autorizada para el médico
        })

        expect(() => {
            medico.agregarDisponibilidades([disponibilidad2]);
        }).toThrow(`La sede "${sede2.nombre}" no está autorizada para el médico "${medico.nombre}"`);
    })
})

describe("Editar la disponibilidad de un médico", () => {
    test("Debería permitir editar una disponibilidad si la sede le corresponde al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const sede1 = { id: "sede1", nombre: "Sede Central" };
        const disponibilidad1 = new DisponibilidadHoraria({
            id: "disp1",
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: sede1
        })

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [sede1], // El médico solo tiene autorizada la sede1
        )

        medico.agregarDisponibilidades([disponibilidad1]);

        const disponibilidadEditada = {
            diaSemana: DiaSemana.LUNES,
            horaDesde: "08:00",
            horaHasta: "16:00",
            sede: sede1
        }

        medico.editarDisponibilidad("disp1", disponibilidadEditada);

        expect(medico.disponibilidades[0].horaDesde).toBe("08:00");
        expect(medico.disponibilidades[0].horaHasta).toBe("16:00");
    })

    test("Debería lanzar un error si se intenta editar una disponibilidad asignándole una sede que no le corresponde al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const sede1 = { id: "sede1", nombre: "Sede Central" };
        const sede2 = { id: "sede2", nombre: "Sede Norte" };
        const disponibilidad1 = new DisponibilidadHoraria({
            id: "disp1",
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: sede1
        })

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [sede1], // El médico solo tiene autorizada la sede1  
        )

        medico.agregarDisponibilidades([disponibilidad1]);

        expect(medico.disponibilidades).toEqual([disponibilidad1]);

        const disponibilidadEditada = {
            diaSemana: DiaSemana.LUNES,
            horaDesde: "08:00",
            horaHasta: "16:00",
            sede: sede2 // La sede2 no está autorizada para el médico
        }

        expect(() => {
            medico.editarDisponibilidad("disp1", disponibilidadEditada);
        }).toThrow(`La sede "${sede2.nombre}" no está autorizada para el médico "${medico.nombre}"`);
    })
})

describe("Agregar servicios a un médico", () => {
    test("Debería permitir agregar un servicio al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const sede = { id: "sede1", nombre: "Sede Central" };

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [sede]
        )

        const practica1 = new Practica(
            "practica1",
            "Consulta General",
            30,
            1000
        )
        practica1._id = "practica1"; // Asignar un ID para simular que viene de la base de datos
        practica1.tipoServicio = "practica"; // Asegurar que el tipo de servicio sea "practica"

        medico.agregarServicio(practica1);

        console.log("Prácticas del médico:", medico.practicas);

        expect(medico.practicas.length).toBe(1);
    })
})

describe("Generar turnos de un médico", () => {
    test("Debería generar los turnos de un médico para un servicio prestado en particular", () => {
        const usuario = new Usuario("medico1", "password123");
        const sede = {_id: new mongoose.Types.ObjectId("507f11111111111799439011"), nombre: "Sede Central", direccion:"Direccion" };

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [sede._id]
        )

        // Mock de una práctica para agregar al médico
        const practica1 = new Practica(
            "practica1",
            "Consulta General",
            30,
            1000
        )

        practica1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"); // Asignar un ID para simular que viene de la base de datos
        practica1.tipoServicio = "practica"; // Asegurar que el tipo de servicio sea "practica"

        medico.agregarServicio(practica1);

        const disponibilidad1 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "11:00",
            sede: sede._id,
            prestacion: practica1
        })

        medico.agregarDisponibilidades([disponibilidad1]);

        const turnosGenerados = medico.generarTurnosPara(practica1);

        console.log("Médico al que se generaron los turnos", medico);
        expect(turnosGenerados.length).toBe(4); // Debería generar 4 turnos de 30 minutos cada uno
    })
})

//import { DiaSemana} from "../../../../src/domain/enum/DiaSemana.js";
/* 2 IMPLEMENTACIONES DE MEDICO TEST */
/* describe("Medico", () => {
    describe("Creación de un médico", () => {
        test("Debería crear un médico con los datos proporcionados", () => {

            const usuario = new Usuario("medico1", "password123");
            const sede = { id: "sede1", nombre: "Sede Central" };
            const disponibilidad = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede
            })
            const medico = new Medico(
                usuario, // Usuario asociado al médico
                "12345", // Matrícula del médico
                "Dr. Juan Pérez", // Nombre del médico
                [], // Especialidades
                [], // Prácticas
                [sede], // Sedes
                [disponibilidad]  // Disponibilidades
            )

            expect(medico.usuario).toBe(usuario);
            expect(medico.matricula).toBe("12345");
            expect(medico.nombre).toBe("Dr. Juan Pérez");
            expect(medico.especialidades).toEqual([]);
            expect(medico.practicas).toEqual([]);
            expect(medico.sedes).toEqual([sede]);
            expect(medico.disponibilidades).toEqual([disponibilidad]);
        })
    })

    describe("Agregar disponibilidad horaria a un médico", () => {
        test("Debería agregar una nueva disponibilidad horaria al médico", () => {
            const usuario = new Usuario("medico1", "password123");
            const sede = { id: "sede1", nombre: "Sede Central" };
            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede
            })
            const medico = new Medico(
                usuario,
                "12345",
                "Dr. Juan Pérez",
                [],
                [],
                [sede],
                [disponibilidad1]
            )

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "10:00",
                horaHasta: "16:00",
                sede: sede
            })

            medico.agregarDisponibilidades([disponibilidad2]);
            expect(medico.disponibilidades).toEqual([disponibilidad1, disponibilidad2]);
        })

        test("Debería lanzar un error si se agrega una disponibilidad que no corresponde a una sede autorizada para el médico", () => {
            const usuario = new Usuario("medico1", "password123");
            const sede1 = { id: "sede1", nombre: "Sede Central" };
            const sede2 = { id: "sede2", nombre: "Sede Norte" };
            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede1
            })
            const medico = new Medico(
                usuario,
                "12345",
                "Dr. Juan Pérez",
                [],
                [],
                [sede1], // El médico solo tiene autorizada la sede1
                [disponibilidad1]
            )

            expect(medico.disponibilidades).toEqual([disponibilidad1]);

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "10:00",
                horaHasta: "16:00",
                sede: sede2 // La sede2 no está autorizada para el médico
            })

            expect(() => {
                medico.agregarDisponibilidades([disponibilidad2]);
            }).toThrow(`La sede "${sede2.nombre}" no está autorizada para el médico "${medico.nombre}"`);
        })
    })

    describe("Editar la disponibilidad de un médico", () => {
        test("Debería permitir editar una disponibilidad si la sede le corresponde al médico", () => {
            const usuario = new Usuario("medico1", "password123");
            const sede1 = { id: "sede1", nombre: "Sede Central" };
            const disponibilidad1 = new DisponibilidadHoraria({
                id: "disp1",
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede1
            })

            const medico = new Medico(
                usuario,
                "12345",
                "Dr. Juan Pérez",
                [],
                [],
                [sede1], // El médico solo tiene autorizada la sede1
                [disponibilidad1]
            )

            const disponibilidadEditada = {
                diaSemana: DiaSemana.LUNES,
                horaDesde: "08:00",
                horaHasta: "16:00",
                sede: sede1
            }

            medico.editarDisponibilidad("disp1", disponibilidadEditada);

            expect(medico.disponibilidades[0].horaDesde).toBe("08:00");
            expect(medico.disponibilidades[0].horaHasta).toBe("16:00");
        })

        test("Debería lanzar un error si se intenta editar una disponibilidad asignándole una sede que no le corresponde al médico", () => {
            const usuario = new Usuario("medico1", "password123");
            const sede1 = { id: "sede1", nombre: "Sede Central" };
            const sede2 = { id: "sede2", nombre: "Sede Norte" };
            const disponibilidad1 = new DisponibilidadHoraria({
                id: "disp1",
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede1
            })

            const medico = new Medico(
                usuario,
                "12345",
                "Dr. Juan Pérez",
                [],
                [],
                [sede1], // El médico solo tiene autorizada la sede1
                [disponibilidad1]
            )

            const disponibilidadEditada = {
                diaSemana: DiaSemana.LUNES,
                horaDesde: "08:00",
                horaHasta: "16:00",
                sede: sede2 // La sede2 no está autorizada para el médico
            }

            expect(() => {
                medico.editarDisponibilidad("disp1", disponibilidadEditada);
            }).toThrow(`La sede "${sede2.nombre}" no está autorizada para el médico "${medico.nombre}"`);
        })
    })
}) */