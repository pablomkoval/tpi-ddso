import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { SedeService } from "../../../src/services/sede.service.js";
import { UnprocessableEntityError } from "../../../src/shared/errors/AppError.js";

describe("SedeService", () => {
    let service;
    let sedeRepositoryMock;

    beforeEach(() => {
        sedeRepositoryMock = {
            save: jest.fn(),
            findAll: jest.fn()
        };

        service = new SedeService(sedeRepositoryMock);
    });

    describe("create", () => {
        test("Debería crear una sede correctamente con datos válidos", async () => {
            const dataSede = { nombre: "Sede Medrano", direccion: "Medrano 951" };

            sedeRepositoryMock.save.mockResolvedValue({ _id: "sede1", ...dataSede });

            const resultado = await service.create(dataSede);

            expect(resultado.nombre).toBe(dataSede.nombre);
            expect(resultado.direccion).toBe(dataSede.direccion);
        });

        test("Debería lanzar un error si falta el nombre de la sede", async () => {
            const dataInvalida = { direccion: "Medrano 951" };

            await expect(service.create(dataInvalida)).rejects.toThrow(UnprocessableEntityError);
            expect(sedeRepositoryMock.save).not.toHaveBeenCalled();
        });

        test("Debería lanzar un error si falta la dirección de la sede", async () => {
            const dataInvalida = { nombre: "Sede Medrano" };

            await expect(service.create(dataInvalida)).rejects.toThrow(UnprocessableEntityError);
            expect(sedeRepositoryMock.save).not.toHaveBeenCalled();
        });
    });

    describe("findAll", () => {
        test("Debería retornar todas las sedes del repositorio", async () => {
            const listaSedesMock = [
                { _id: "1", nombre: "Sede Medrano", direccion: "Medrano 951" },
                { _id: "2", nombre: "Sede Campus", direccion: "Mozart 2300" }
            ];

            sedeRepositoryMock.findAll.mockResolvedValue(listaSedesMock);

            const resultado = await service.findAll();

            expect(sedeRepositoryMock.findAll).toHaveBeenCalled();
            expect(resultado).toEqual(listaSedesMock);
            expect(resultado.length).toBe(2);
        });
    });
});