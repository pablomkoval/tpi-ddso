import { describe, test, expect } from "@jest/globals";
import MedicoService from "../../../../src/services/MedicoService";

describe("Servicios Médico", () => {
    describe("Creación de un médico", () => {
        test("Debería crear un médico con los datos proporcionados", () => {
            const servicio = new MedicoService();
            const medicoDTO = {
                usuario: { username: "medico1", password: "password123" },
                matricula: "12345",
                nombre: "Dr. Juan Pérez",
                especialidades: [],
                practicas: [],
                sedes: [{ id: "sede1", nombre: "Sede Central" }],
                disponibilidades: [
                    {
                        diaSemana: "LUNES",
                        horaDesde: "09:00",
                        horaHasta: "17:00",
                        sede: { id: "sede1", nombre: "Sede Central" }
                    }
                ]
            };

            const medicoCreado = servicio.create(medicoDTO);

            expect(medicoCreado).toMatchObject({
                usuario: medicoDTO.usuario,
                matricula: medicoDTO.matricula,
                nombre: medicoDTO.nombre,
                especialidades: medicoDTO.especialidades,
                practicas: medicoDTO.practicas,
                sedes: medicoDTO.sedes,
                disponibilidades: medicoDTO.disponibilidades
            });
        });
    });
});
