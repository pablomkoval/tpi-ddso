import { describe, test, expect } from "@jest/globals";

import { DisponibilidadHoraria } from "../../../../src/domain/models/entities/medico/DisponibilidadHoraria";

describe("DisponibilidadHoraria", () => {
    describe("Creación de una disponibilidad horaria", () => {
        test("Debería crear una disponibilidad horaria con los datos proporcionados", () => {
            const sede = { id: "sede1", nombre: "Sede Central" };
            const disponibilidad = new DisponibilidadHoraria({
                diaSemana: "LUNES",
                horaDesde: "09:00",
                horaHasta: "17:00",
                sede: sede
            })

            expect(disponibilidad.diaSemana).toBe("LUNES");
            expect(disponibilidad.horaDesde).toBe("09:00");
            expect(disponibilidad.horaHasta).toBe("17:00");
            expect(disponibilidad.sede).toEqual(sede);
        })
    })
        
})