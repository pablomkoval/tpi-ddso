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
                servicioMedico: practica
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

            console.log("Disponibilidades del médico creado: ", medico.disponibilidades)

            medico.generarTurnos(7);

            console.log("Turnos generados: ", medico.turnos);
            expect(medico.turnos.length).toBe(16);
            expect(medico.turnos[0].fechaHora).toBeDefined();
            expect(medico.turnos[0].servicio).toBe(practica);
        })        
    })
})