import { describe, test, expect } from "@jest/globals";
import Medico from "../../../../src/domain/models/entities/medico/Medico.js";
import { DisponibilidadHoraria } from "../../../../src/domain/models/entities/medico/DisponibilidadHoraria.js";
import { Usuario } from "../../../../src/domain/models/entities/Usuario.js"
import { Practica } from "../../../../src/domain/models/entities/medico/Practica.js";
import { DiaSemana } from "../../../../src/domain/enum/DiaSemana.js";

describe("Turnos", () => {
    describe("Generación de turnos para un médico con disponibilidad horaria", () => {
        test("Debería generar turnos correctamente según la disponibilidad y duración del servicio", () => {

            const usuario = new Usuario("medico1", "password123");
            const sede = { id: "sede1", nombre: "Sede Central" };
            const practica = new Practica(
                "p1", // Código
                "Traumatología", // Nombre
                30, // Duración en minutos
                1000 // Costo
            )

            const disponibilidad = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede,
                prestacion: practica
            })
            
            const medico = new Medico(
                usuario, // Usuario asociado al médico
                "12345", // Matrícula del médico
                "Dr. Juan Pérez", // Nombre del médico
                [], // Especialidades
                [practica], // Prácticas
                [sede], // Sedes
                [disponibilidad]  // Disponibilidades
            )

            medico.generarTurnos(7);
            expect(medico.turnos.length).toBe(16);
            expect(medico.turnos[0].fechaHora).toBeDefined();
            expect(medico.turnos[0].servicio).toBe(practica);
        })        
    })

    describe("Generación de turnos para un médico con múltiples disponibilidades horarias", () => {
        test("Debería generar turnos correctamente para todas las disponibilidades del médico", () => {
            const usuario = new Usuario("medico1", "password123");
            const sede1 = { id: "sede1", nombre: "Sede Central" };
            const sede2 = { id: "sede2", nombre: "Sede Norte" };
            const practica = new Practica(
                "p1", // Código
                "Traumatología", // Nombre
                60, // Duración en minutos
                1000 // Costo
            )

            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "09:00",
                horaHasta: "11:00",
                sede: sede1,
                prestacion: practica
            })

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "09:00",
                horaHasta: "11:00",
                sede: sede2,
                prestacion: practica
            })
            
            const medico = new Medico(
                usuario, // Usuario asociado al médico
                "12345", // Matrícula del médico
                "Dr. Juan Pérez", // Nombre del médico
                [], // Especialidades
                [practica], // Prácticas
                [sede1, sede2], // Sedes
                [disponibilidad1, disponibilidad2]  // Disponibilidades
            )

            medico.generarTurnos(7);

            expect(medico.turnos.length).toBe(4);
            expect(medico.turnos[0].fechaHora).toBeDefined();
            expect(medico.turnos[0].servicio).toBe(practica);
        })
    })

    describe("Generación de turnos para un médico con varias practicas y disponibilidades", () => {
        test("Debería generar turnos correctamente para todas las prácticas y disponibilidades del médico", () => {
            const usuario = new Usuario("medico1", "password123");
            const sede1 = { id: "sede1", nombre: "Sede Central" };
            const sede2 = { id: "sede2", nombre: "Sede Norte" };
            const practica1 = new Practica(
                "p1", // Código
                "Traumatología", // Nombre
                60, // Duración en minutos
                1000 // Costo
            )

            const practica2 = new Practica(
                "p2", // Código
                "Cardiología", // Nombre
                60, // Duración en minutos
                1500 // Costo
            )

            const disponibilidad1 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.LUNES,
                horaDesde: "12:00",
                horaHasta: "14:00",
                sede: sede1,
                prestacion: practica1
            })

            const disponibilidad2 = new DisponibilidadHoraria({
                diaSemana: DiaSemana.MARTES,
                horaDesde: "12:00",
                horaHasta: "14:00",
                sede: sede2,
                prestacion: practica2
            })
            
            const medico = new Medico(
                usuario, // Usuario asociado al médico
                "12345", // Matrícula del médico
                "Dr. Juan Pérez", // Nombre del médico
                [], // Especialidades
                [practica1, practica2], // Prácticas
                [sede1, sede2], // Sedes
                [disponibilidad1, disponibilidad2]  // Disponibilidades
            )

            medico.generarTurnos(7);
            
            expect(medico.turnos.length).toBe(4);
            expect(medico.turnos[0].servicio).toBe(practica1);
            expect(medico.turnos[1].servicio).toBe(practica1);
            expect(medico.turnos[2].servicio).toBe(practica2);
            expect(medico.turnos[3].servicio).toBe(practica2); 
        })
    })
})