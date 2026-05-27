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
        
})