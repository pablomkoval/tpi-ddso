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
            const sede = { _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), nombre: "Sede Central" };
            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [], [sede]);

            expect(medico.usuario).toBe(usuario);
            expect(medico.matricula).toBe("12345");
            expect(medico.nombre).toBe("Dr. Juan Pérez");
            expect(medico.sedes).toEqual([sede]);
        });
    });

    describe("Agregar disponibilidad horaria a un médico", () => {
        test("Debería agregar una nueva disponibilidad horaria al médico", () => {
            const usuario = new Usuario("medico1", "password123");
            const sede = { _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), nombre: "Sede Central" };

            const practica = new Practica("practica1", "General", 30, 100);
            practica._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [], [sede]);
            medico.agregarServicio(practica);

            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede._id,
                prestacion: practica
            });

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "10:00",
                horaHasta: "16:00",
                sede: sede._id,
                prestacion: practica
            });

            medico.agregarDisponibilidades([disponibilidad1, disponibilidad2]);
            expect(medico.disponibilidades).toEqual([disponibilidad1, disponibilidad2]);
        });

        test("Debería lanzar un error si se agrega una disponibilidad que no corresponde a una sede autorizada para el médico", () => {
            const usuario = new Usuario("medico1", "contrasenia123");
            const sede1 = { _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), nombre: "Sede Medrano" };
            const sede2 = { _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"), nombre: "Sede Lugano" };

            const practica = new Practica("practica1", "General", 30, 100);
            practica._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [], [sede1]);
            medico.agregarServicio(practica);

            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede1._id,
                prestacion: practica
            });

            medico.agregarDisponibilidades([disponibilidad1]);

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "10:00",
                horaHasta: "16:00",
                sede: sede2._id,
                prestacion: practica
            });

            expect(() => {
                medico.agregarDisponibilidades([disponibilidad2]);
            }).toThrow(`La sede de ID "${sede2._id}" no está autorizada para el médico "${medico.nombre}"`);
        });
    });

    describe("Editar la disponibilidad de un médico", () => {
        test("Debería permitir editar una disponibilidad si la sede le corresponde al médico", () => {
            const usuario = new Usuario("medico1", "contrasenia123");
            const idComun = "507f1f77bcf86cd799439011";

            const sede1 = {
                _id: new mongoose.Types.ObjectId(idComun),
                nombre: "Sede Central",
                equals: function (otroId) { return String(this._id) === String(otroId); }
            };

            const practica = new Practica("practica1", "General", 30, 100);
            practica._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

            const disponibilidadId = "507f1f77bcf86cd799439033";
            const disponibilidad1 = new DisponibilidadHoraria({
                id: disponibilidadId,
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede1._id,
                prestacion: practica
            });

            disponibilidad1._id = new mongoose.Types.ObjectId(disponibilidadId);

            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [], [sede1]);
            medico.agregarServicio(practica);
            medico.agregarDisponibilidades([disponibilidad1]);

            const disponibilidadEditada = {
                diaSemana: DiaSemana.LUNES,
                horaDesde: "08:00",
                horaHasta: "16:00",
                sede: sede1._id,
                prestacion: practica
            };

            medico.editarDisponibilidad(disponibilidadId, disponibilidadEditada);

            expect(medico.disponibilidades[0].horaDesde).toBe("08:00");
            expect(medico.disponibilidades[0].horaHasta).toBe("16:00");
        });
    });

    describe("Agregar servicios a un médico", () => {
        test("Debería permitir agregar un servicio al médico", () => {

            const usuario = new Usuario("medico1", "contrasenia123");
            const sede = { _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"), nombre: "Sede Central" };
            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [], [sede]);

            const practica1 = new Practica("practica1", "Consulta General", 30, 1000);
            practica1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");
            practica1.tipoServicio = "practica";

            medico.agregarServicio(practica1);
            expect(medico.practicas.length).toBe(1);
        });
    });

    describe("Generar turnos de un médico", () => {
        test("Debería generar los turnos de un médico para un servicio prestado en particular", () => {

            const usuario = new Usuario("medico1", "contrasenia123");
            const sede = { _id: new mongoose.Types.ObjectId("507f11111111111799439011"), nombre: "Sede Medrano", direccion: "Direccion" };

            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [], [sede._id]);

            const practica1 = new Practica("practica1", "Consulta General", 30, 1000);
            practica1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
            practica1.tipoServicio = "practica";

            medico.agregarServicio(practica1);

            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "11:00",
                sede: sede._id,
                prestacion: practica1
            });
            disponibilidad1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439055");

            medico.agregarDisponibilidades([disponibilidad1]);

            const turnosGenerados = medico.generarTurnosPara(practica1);
            expect(turnosGenerados.length).toBe(4);
        });
    });
});