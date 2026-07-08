import { describe, test, expect } from "@jest/globals";
import { DiaSemana } from "../../../../src/domain/enum/DiaSemana.js";
import { DisponibilidadHoraria } from "../../../../src/domain/models/entities/medico/DisponibilidadHoraria";
import mongoose from "mongoose";

describe("DisponibilidadHoraria", () => {
    describe("Creación de una disponibilidad horaria", () => {
        test("Debería crear una disponibilidad horaria con los datos proporcionados", () => {
            const sede = { id: "sede1", nombre: "Sede Central" };
            const disponibilidad = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede
            })

            expect(disponibilidad.diaSemana).toBe(DiaSemana.LUNES);
            expect(disponibilidad.horaDesde).toBe("09:00");
            expect(disponibilidad.horaHasta).toBe("17:00");
            expect(disponibilidad.sede).toEqual(sede);
        })

        test("Debería lanzar un error si el día de semana no es válido", () => {
            expect(() => {
                new DisponibilidadHoraria({
                    diaSemana: 10,
                    horaDesde: "09:00",
                    horaHasta: "17:00",
                    sede: { id: "sede1", nombre: "Sede Central" }
                })
            }).toThrow('El día de semana "10" no es válido');
        })

        test("Debería lanzar un error si el horario no tiene un formato válido", () => {
            expect(() => {
                new DisponibilidadHoraria({
                    diaSemana: DiaSemana.LUNES,
                    horaDesde: "9 AM",
                    horaHasta: "5 PM",
                    sede: { id: "sede1", nombre: "Sede Central" }
                })
            }).toThrow('El horario "9 AM" no tiene un formato válido (esperado HH:MM)');
        })

        test("Debería lanzar un error si la hora de inicio no es anterior a la hora de fin", () => {
            expect(() => {
                new DisponibilidadHoraria({
                    diaSemana: DiaSemana.LUNES,
                    horaDesde: "17:00",
                    horaHasta: "09:00",
                    sede: { id: "sede1", nombre: "Sede Central" }
                })
            }).toThrow('La hora de inicio (17:00) debe ser anterior a la hora de fin (09:00)');
        })
    })

    describe("Validar que la disponibilidad se solape con otra", () => {
        test("Debería retornar true si las disponibilidades se solapan", () => {
            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: { id: "sede1", nombre: "Sede Central" }
            })

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "16:00",
                horaHasta: "18:00",
                sede: { id: "sede1", nombre: "Sede Central" }
            })
            disponibilidad1._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439044");
            disponibilidad2._id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439055");

            expect(disponibilidad1.seSolapaCon(disponibilidad2)).toBe(true);
        })

        test("Debería retornar false si las disponibilidades no se solapan", () => {
            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: { id: "sede1", nombre: "Sede Central" }
            })

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: { id: "sede1", nombre: "Sede Central" }
            })

            expect(disponibilidad1.seSolapaCon(disponibilidad2)).toBe(false);
        })
    })
})