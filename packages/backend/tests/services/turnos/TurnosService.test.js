// packages/backend/tests/services/turnos/TurnosService.test.js
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { TurnoService } from "../../../src/services/turno.service.js";
import { NivelCobertura } from "../../../src/domain/enum/NivelCobertura.js";
import AppError from "../../../src/shared/errors/AppError.js";

describe("Turnos Service tests", () => {
    let service;
    let turnoRepositoryMock;
    let medicoServiceMock;
    let pacienteServiceMock;
    let servicioServiceMock;

    beforeEach(() => {
        turnoRepositoryMock = {
            buscarDisponibles: jest.fn().mockResolvedValue({
                turnos: [
                    {
                        _id: "turno1",
                        costo: 2000,
                        servicio: { _id: "practica1", tipoServicio: "practica", costo: 2000 }
                    }
                ],
                total: 1
            }),
            findById: jest.fn(),
            update: jest.fn()
        };

        medicoServiceMock = { findById: jest.fn() };
        pacienteServiceMock = { findById: jest.fn() };
        servicioServiceMock = { findOriginalServicioById: jest.fn(), findPrestacionById: jest.fn() };

        service = new TurnoService(
            turnoRepositoryMock,
            medicoServiceMock,
            pacienteServiceMock,
            servicioServiceMock
        );
    });

    describe("buscarDisponibles() valida los filtros", () => {
        test("Debería lanzar un error si no se especifica una prestación", async () => {
            await expect(service.buscarDisponibles({ paciente: "paciente1" }))
                .rejects
                .toThrow(AppError);
        });

        test("Debería lanzar un error si las fechas están invertidas", async () => {
            servicioServiceMock.findPrestacionById.mockResolvedValue({ _id: "practica1" });

            await expect(
                service.buscarDisponibles({
                    prestacion: "practica1",
                    paciente: "paciente1",
                    fechaDesde: "2026-06-20",
                    fechaHasta: "2026-06-10"
                })
            ).rejects.toThrow("La fecha de inicio no puede ser posterior a la fecha de fin");
        });
    });

    describe("buscarDisponibles() calcula las coberturas", () => {
        test("Debería calcular costo 0 si el paciente tiene cobertura total para la práctica", async () => {

            servicioServiceMock.findPrestacionById.mockResolvedValue({
                _id: "practica1",
                tipoServicio: "practica"
            });

            pacienteServiceMock.findById.mockResolvedValue({
                _id: "paciente1",
                plan: {
                    coberturasPractica: [
                        { practica: "practica1", nivel: NivelCobertura.TOTAL }
                    ]
                }
            });

            const resultado = await service.buscarDisponibles({
                prestacion: "practica1",
                paciente: "paciente1"
            });

            expect(resultado.turnos[0].cobertura).toBe(NivelCobertura.TOTAL);
            expect(resultado.turnos[0].costoPaciente).toBe(0);
        });

        test("Debería aplicar 50% de descuento si el paciente tiene cobertura parcial", async () => {
            servicioServiceMock.findPrestacionById.mockResolvedValue({
                _id: "practica1",
                tipoServicio: "practica"
            });

            pacienteServiceMock.findById.mockResolvedValue({
                _id: "paciente1",
                plan: {
                    coberturasPractica: [
                        { practica: "practica1", nivel: NivelCobertura.PARCIAL }
                    ]
                }
            });

            const resultado = await service.buscarDisponibles({
                prestacion: "practica1",
                paciente: "paciente1"
            });

            expect(resultado.turnos[0].cobertura).toBe(NivelCobertura.PARCIAL);
            expect(resultado.turnos[0].costoPaciente).toBe(1000);
        });
    });
});