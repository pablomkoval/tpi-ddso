import { NotificacionesService } from "../../../src/services/notificaciones.service";
import { describe, test, expect, jest, beforeEach } from "@jest/globals";

describe("Capa de servicio - NotificacionService", () => {
    let mockRepository;
    let service;

    beforeEach(() => {
        mockRepository = {
            findAllPaginated: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn()
        };

        service = new NotificacionesService(mockRepository);
    });

    test("obtenerNoLeidas() debe armar los criterios y devolver la estructura paginada", async () => {
        const mockRespuestaRepo = {
            notificaciones: [
                { id: "6a173108ed88078b483f887b", destinatario: "6470abc12345678901234567", remitente: "647012398765432109876543", leida: false, mensaje: "Turno 1", fechaHoraCreacion: new Date("2026-05-25") },
                { id: "6a173112ed88078b483f887c", destinatario: "6470abc12345678901234567", remitente: "647012398765432109876543", leida: false, mensaje: "Turno 2", fechaHoraCreacion: new Date("2026-05-25") }
            ],
            total: 2,
            page: 1,
            totalPages: 1
        };

        mockRepository.findAllPaginated.mockResolvedValue(mockRespuestaRepo);

        const resultado = await service.obtenerNoLeidas("6470abc12345678901234567", 1, 5);

        expect(mockRepository.findAllPaginated).toHaveBeenCalledWith(
            { destinatario: "6470abc12345678901234567", leida: false },
            1,
            5
        );

        expect(resultado.total).toBe(2);
        expect(resultado.totalPages).toBe(1);
        expect(resultado.notificaciones[0]).toEqual({
            id: "6a173108ed88078b483f887b",
            destinatario: "6470abc12345678901234567",
            remitente: "647012398765432109876543",
            mensaje: "Turno 1",
            leida: false,
            fechaHoraCreacion: new Date("2026-05-25")
        });
    });

    test("softDelete() llama al método de borrado del repositorio", async () => {
        const id = "6a173108ed88078b483f887b";
        mockRepository.softDelete.mockResolvedValue();

        await service.softDelete(id);

        expect(mockRepository.softDelete).toHaveBeenCalledWith(id);
    });
})