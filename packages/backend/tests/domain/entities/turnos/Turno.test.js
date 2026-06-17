import { describe, test, expect } from "@jest/globals";
import Medico from "../../../../src/domain/models/entities/medico/Medico.js";
import { DisponibilidadHoraria } from "../../../../src/domain/models/entities/medico/DisponibilidadHoraria.js";
import { Usuario } from "../../../../src/domain/models/entities/Usuario.js"
import { Practica } from "../../../../src/domain/models/entities/medico/Practica.js";
import { DiaSemana } from "../../../../src/domain/enum/DiaSemana.js";
import mongoose from "mongoose";

describe("Turnos", () => {
    describe("Generación de turnos para un médico con disponibilidad horaria", () => {
        test("Debería generar turnos correctamente según la disponibilidad y duración del servicio", () => {

            const usuario = new Usuario("medico1", "contrasenia123");

            const sedeId = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
            const practicaId = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

            const practica = new Practica("practica1", "Traumatología", 30, 1000);
            practica._id = practicaId;

            const disponibilidad = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sedeId,
                prestacion: practica
            });

            disponibilidad._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439033");

            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [practicaId], [sedeId]);
            medico.disponibilidades = [disponibilidad];

            const turnosGenerados = medico.generarTurnosPara(practica);
            expect(turnosGenerados.length).toBe(16);
            expect(turnosGenerados[0].fechaHora).toBeDefined();
        });
    });

    describe("Generación de turnos para un médico con múltiples disponibilidades horarias", () => {
        test("Debería generar turnos correctamente para todas las disponibilidades del médico", () => {

            const usuario = new Usuario("medico1", "contrasenia123");
            const sedeId1 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
            const sedeId2 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439012");
            const practicaId = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

            const practica = new Practica("practica1", "Traumatología", 60, 1000);
            practica._id = practicaId;

            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "11:00",
                sede: sedeId1,
                prestacion: practica
            });

            disponibilidad1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439031");

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "09:00",
                horaHasta: "11:00",
                sede: sedeId2,
                prestacion: practica
            });
            disponibilidad2._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439032");

            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [practicaId], [sedeId1, sedeId2]);
            medico.disponibilidades = [disponibilidad1, disponibilidad2];

            const turnosGenerados = medico.generarTurnosPara(practica);
            expect(turnosGenerados.length).toBe(4);
        });
    });

    describe("Generación de turnos para un médico con varias practicas y disponibilidades", () => {
        test("Debería generar turnos correctamente para todas las prácticas y disponibilidades del médico", () => {

            const usuario = new Usuario("medico1", "contrasenia123");
            const sedeId1 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
            const sedeId2 = new mongoose.Types.ObjectId("507f1f77bcf86cd799439012");

            const practica1 = new Practica("practica1", "Traumatología", 60, 1000);
            practica1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439021");

            const practica2 = new Practica("practica2", "Cardiología", 60, 1500);
            practica2._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439022");

            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "12:00",
                horaHasta: "14:00",
                sede: sedeId1,
                prestacion: practica1
            });

            disponibilidad1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439031");

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "12:00",
                horaHasta: "14:00",
                sede: sedeId2,
                prestacion: practica2
            });

            disponibilidad2._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439032");

            const medico = new Medico(usuario, "12345", "Dr. Juan Pérez", [], [practica1, practica2], [sedeId1, sedeId2]);
            medico.disponibilidades = [disponibilidad1, disponibilidad2];

            const turnosGenerados = medico.generarTurnos(7);
            expect(turnosGenerados.length).toBe(4);
        });
    });
});