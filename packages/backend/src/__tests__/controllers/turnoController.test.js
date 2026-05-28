import { jest } from "@jest/globals";

const mockTurnoService = {
  buscarDisponibles: jest.fn(),
  obtenerPorId: jest.fn(),
};

jest.unstable_mockModule("../../services/turnoService.js", () => ({
  default: mockTurnoService,
}));

const { default: turnoController } = await import(
  "../../controllers/turnoController.js"
);

describe("TurnoController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDisponibles", () => {
    it("responde 200 con { status: 'success', data } cuando el service resuelve", async () => {
      const resultadoMock = {
        turnos: [{ _id: "t1" }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      mockTurnoService.buscarDisponibles.mockResolvedValue(resultadoMock);

      const req = { query: { paciente: "pac1", especialidad: "esp1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await turnoController.getDisponibles(req, res, next);

      expect(mockTurnoService.buscarDisponibles).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: resultadoMock,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("llama a next(error) cuando el service rechaza", async () => {
      const errorMock = new Error("boom");
      mockTurnoService.buscarDisponibles.mockRejectedValue(errorMock);

      const req = { query: { paciente: "pac1", especialidad: "esp1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await turnoController.getDisponibles(req, res, next);

      expect(mockTurnoService.buscarDisponibles).toHaveBeenCalledWith(req.query);
      expect(next).toHaveBeenCalledWith(errorMock);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("responde 200 con { status: 'success', data } cuando el service resuelve", async () => {
      const turnoMock = { _id: "t1" };
      mockTurnoService.obtenerPorId.mockResolvedValue(turnoMock);

      const req = { params: { id: "t1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await turnoController.getById(req, res, next);

      expect(mockTurnoService.obtenerPorId).toHaveBeenCalledWith("t1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: turnoMock,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("llama a next(error) cuando el service rechaza", async () => {
      const errorMock = new Error("boom");
      mockTurnoService.obtenerPorId.mockRejectedValue(errorMock);

      const req = { params: { id: "t1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await turnoController.getById(req, res, next);

      expect(mockTurnoService.obtenerPorId).toHaveBeenCalledWith("t1");
      expect(next).toHaveBeenCalledWith(errorMock);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});