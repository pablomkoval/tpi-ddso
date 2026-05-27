import { NotificacionesService } from "../../../src/services/notificaciones.service";
import { describe, test, expect, jest } from "@jest/globals";

describe("Capa de servicio - NotificacionService", () => {
    test("obtenerNoLeidas() debe armar los criterios y devolver la estructura paginada", async () => {
        const mockRespuestaRepo = {
            notificaciones: [
                {id: "6a173108ed88078b483f887b", destinatario: "6470abc12345678901234567", leida: false, mensaje: "Turno 1"},
                {id: "6a173112ed88078b483f887c", destinatario: "6470abc12345678901234567", leida: false, mensaje: "Turno 2"}
            ],
            total: 2,
            page: 1,
            totalPages: 1
        };

        const mockRepository = {
            findAllPaginated: jest.fn().mockResolvedValue(mockRespuestaRepo)
        };

        const servicio = new NotificacionesService(mockRepository);

        servicio.toDTO = (n) => ({ id: n.id, texto: n.mensaje, estadoLeido: n.leida });

        const resultado = await servicio.obtenerNoLeidas("6470abc12345678901234567", 1, 5);

        expect(mockRepository.findAllPaginated).toHaveBeenCalledWith(
            { destinatario: "6470abc12345678901234567", leida: false },
            1,
            5
        );

        expect(resultado.total).toBe(2);
        expect(resultado.totalPages).toBe(1);
        expect(resultado.notificaciones[0]).toEqual({ id: "6a173108ed88078b483f887b", texto: "Turno 1", estadoLeido: false });
    });
})