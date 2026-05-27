import { describe, test, expect } from "@jest/globals";
import Medico from "../../../../src/domain/models/entities/medico/Medico";
import { DisponibilidadHoraria } from "../../../../src/domain/models/entities/medico/DisponibilidadHoraria";
import { Usuario } from "../../../../src/domain/models/entities/Usuario"

describe("Medico", () => {
    describe("Creación de un médico", () => {
        test("Debería crear un médico con los datos proporcionados", () => {
            
            const usuario = new Usuario("medico1", "password123");
            const sede = { id: "sede1", nombre: "Sede Central" };
            const disponibilidad = new DisponibilidadHoraria({
                diaSemana: "LUNES",
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
                diaSemana: "LUNES",
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
                diaSemana: "MARTES",
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
                diaSemana: "LUNES",
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
                diaSemana: "MARTES",
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
                diaSemana: "LUNES",
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
                diaSemana: "LUNES",
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
                diaSemana: "LUNES",
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
                diaSemana: "LUNES",
                horaDesde: "08:00",
                horaHasta: "16:00",
                sede: sede2 // La sede2 no está autorizada para el médico
            }

            expect(() => {
                medico.editarDisponibilidad("disp1", disponibilidadEditada);
            }).toThrow(`La sede "${sede2.nombre}" no está autorizada para el médico "${medico.nombre}"`);
        })
    })
})