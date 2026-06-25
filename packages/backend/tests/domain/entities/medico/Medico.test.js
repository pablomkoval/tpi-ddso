import { describe, test, expect } from "@jest/globals";
import Medico from "../../../../src/domain/models/entities/medico/Medico";
import { DisponibilidadHoraria } from "../../../../src/domain/models/entities/medico/DisponibilidadHoraria";
import { Usuario } from "../../../../src/domain/models/entities/Usuario";
import { DiaSemana } from "../../../../src/domain/enum/DiaSemana.js";
import { Practica } from "../../../../src/domain/models/entities/medico/Practica.js";
import mongoose from "mongoose";

describe("Medico Entity Tests", () => {

describe("Creación de un médico", () => {
    test("Debería crear un médico con los datos proporcionados", () => {

        const usuario = new Usuario("medico1", "password123");
        const idSede = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");

        const medico = new Medico(
            usuario, // usuario del medico
            "12345", // matricula del medico
            "Dr. Juan Pérez", // nombre
            [], // especialidades
            [], // practicas
            [idSede], // sedes
        )

        expect(medico.usuario).toBe(usuario);
        expect(medico.matricula).toBe("12345");
        expect(medico.nombre).toBe("Dr. Juan Pérez");
        expect(medico.especialidades).toEqual([]);
        expect(medico.practicas).toEqual([]);
        expect(medico.sedes).toEqual([idSede]);
    })
})

describe("Agregar disponibilidad horaria a un médico", () => {
    test("Debería agregar una nueva disponibilidad horaria al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const idSede = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");

        const practica = new Practica("practica1", "Consulta General", 30, 1000);
        practica._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439055");
        practica.tipoServicio = "practica";

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [idSede]
        )
        medico.agregarServicio(practica);

        const disponibilidad1 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: idSede,
            prestacion: practica
        })

        const disponibilidad2 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.MARTES,
            horaDesde: "10:00",
            horaHasta: "16:00",
            sede: idSede,
            prestacion: practica
        })

        medico.agregarDisponibilidades([disponibilidad1, disponibilidad2]);
        expect(medico.disponibilidades).toEqual([disponibilidad1, disponibilidad2]);
    })

    test("Debería lanzar un error si se agrega una disponibilidad que no corresponde a una sede autorizada para el médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const idSede1 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
        const idSede2 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

        const practica = new Practica("practica1", "Consulta General", 30, 1000);
        practica._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439055");
        practica.tipoServicio = "practica";

        const disponibilidad1 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: idSede1,
            prestacion: practica
        })
        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [idSede1],
        )
        medico.agregarServicio(practica);

        medico.agregarDisponibilidades([disponibilidad1]);

        expect(medico.disponibilidades).toEqual([disponibilidad1]);

        const disponibilidad2 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.MARTES,
            horaDesde: "10:00",
            horaHasta: "16:00",
            sede: idSede2,
            prestacion: practica
        })

        expect(() => {
            medico.agregarDisponibilidades([disponibilidad2]);
        }).toThrow();
    })
})

describe("Editar la disponibilidad de un médico", () => {
    test("Debería permitir editar una disponibilidad si la sede le corresponde al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const idSede1 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");

        const practica = new Practica("practica1", "Consulta General", 30, 1000);
        practica._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439055");
        practica.tipoServicio = "practica";

        const disponibilidad1 = new DisponibilidadHoraria({
            id: "disp1",
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: idSede1,
            prestacion: practica
        })

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [idSede1],
        )
        medico.agregarServicio(practica);

        medico.agregarDisponibilidades([disponibilidad1]);

        const disponibilidadEditada = {
            diaSemana: DiaSemana.LUNES,
            horaDesde: "08:00",
            horaHasta: "16:00",
            sede: idSede1,
            prestacion: practica
        }

        medico.editarDisponibilidad("disp1", disponibilidadEditada);

        expect(medico.disponibilidades[0].horaDesde).toBe("08:00");
        expect(medico.disponibilidades[0].horaHasta).toBe("16:00");
    })

    test("Debería lanzar un error si se intenta editar una disponibilidad asignándole una sede que no le corresponde al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const idSede1 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
        const idSede2 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

        const practica = new Practica("practica1", "Consulta General", 30, 1000);
        practica._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439055");
        practica.tipoServicio = "practica";

        const disponibilidad1 = new DisponibilidadHoraria({
            id: "disp1",
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "17:00",
            sede: idSede1,
            prestacion: practica
        })

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [idSede1],
        )
        medico.agregarServicio(practica);

        medico.agregarDisponibilidades([disponibilidad1]);

        expect(medico.disponibilidades).toEqual([disponibilidad1]);

        const disponibilidadEditada = {
            diaSemana: DiaSemana.LUNES,
            horaDesde: "08:00",
            horaHasta: "16:00",
            sede: idSede2,
            prestacion: practica
        }

        expect(() => {
            medico.editarDisponibilidad("disp1", disponibilidadEditada);
        }).toThrow();
    })
})

describe("Agregar servicios a un médico", () => {
    test("Debería permitir agregar un servicio al médico", () => {
        const usuario = new Usuario("medico1", "password123");
        const idSede = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [idSede]
        )

        const practica1 = new Practica(
            "practica1",
            "Consulta General",
            30,
            1000
        )
        practica1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439055");
        practica1.tipoServicio = "practica";

        medico.agregarServicio(practica1);

        console.log("Prácticas del médico:", medico.practicas);

        expect(medico.practicas.length).toBe(1);
    })
})

describe("Generar turnos de un médico", () => {
    test("Debería generar los turnos de un médico para un servicio prestado en particular", () => {
        const usuario = new Usuario("medico1", "password123");
        const idSede = new mongoose.Types.ObjectId("507f11111111111799439011");

        const medico = new Medico(
            usuario,
            "12345",
            "Dr. Juan Pérez",
            [],
            [],
            [idSede]
        )

        const practica1 = new Practica(
            "practica1",
            "Consulta General",
            30,
            1000
        )

        practica1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
        practica1.tipoServicio = "practica";

        medico.agregarServicio(practica1);

        const disponibilidad1 = new DisponibilidadHoraria({
            diaSemana: DiaSemana.LUNES,
            horaDesde: "09:00",
            horaHasta: "11:00",
            sede: idSede,
            prestacion: practica1
        })

        medico.agregarDisponibilidades([disponibilidad1]);

        const turnosGenerados = medico.generarTurnosPara(practica1);

        console.log("Médico al que se generaron los turnos", medico);
        expect(turnosGenerados.length).toBe(4);
    })
})
})