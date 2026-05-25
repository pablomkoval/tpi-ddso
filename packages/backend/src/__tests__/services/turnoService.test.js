import { jest } from "@jest/globals";
// Mocks de los repos
const mockTurnoRepository = {
  buscarDisponibles: jest.fn(),
};

const mockEspecialidadRepository = {
  findById: jest.fn(),
};

const mockMedicoRepository = {
  findById: jest.fn(),
};

const mockPacienteRepository = {
  findById: jest.fn(),
};

const pacienteMock = {
  _id: "pac1",
  obraSocial: { nombre: "OSDE" },
  plan: {
    nombre: "Plan 310",
    coberturasEspecialidad: [],
    coberturasPractica: [],
  },
};

jest.unstable_mockModule("../../repositories/turnoRepository.js", () => ({
  default: mockTurnoRepository,
}));

jest.unstable_mockModule(
  "../../repositories/especialidadRepository.js",
  () => ({
    default: mockEspecialidadRepository,
  }),
);

jest.unstable_mockModule("../../repositories/medicoRepository.js", () => ({
  default: mockMedicoRepository,
}));

jest.unstable_mockModule("../../repositories/pacienteRepository.js", () => ({
  default: mockPacienteRepository,
}));

const { default: turnoService } =
  await import("../../services/turnoService.js");
const { AppError } = await import("../../shared/errors/AppError.js");

describe("TurnoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buscarDisponibles", () => {
    it("debe lanzar error 400 si no se proporciona especialidad ni práctica", async () => {
      const params = {};
      await expect(turnoService.buscarDisponibles(params)).rejects.toThrow(
        AppError,
      );
      await expect(
        turnoService.buscarDisponibles(params),
      ).rejects.toMatchObject({
        statusCode: 400,
        codigo: "FILTRO_REQUERIDO",
      });
    });

    it("debe lanzar error 404 si la especialidad no existe", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue(null);
      const params = { especialidad: "507f1f77bcf86cd799439011" };

      await expect(
        turnoService.buscarDisponibles(params),
      ).rejects.toMatchObject({
        statusCode: 404,
        codigo: "ESPECIALIDAD_NO_ENCONTRADA",
      });

      expect(mockEspecialidadRepository.findById).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
      );
    });

    it("debe lanzar error 404 si el profesional no existe", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue({
        _id: "esp1",
        nombre: "Cardiología",
      });
      mockMedicoRepository.findById.mockResolvedValue(null);
      const params = {
        especialidad: "esp1",
        profesional: "medico_inexistente",
      };

      await expect(
        turnoService.buscarDisponibles(params),
      ).rejects.toMatchObject({
        statusCode: 404,
        codigo: "PROFESIONAL_NO_ENCONTRADO",
      });
    });

    it("debe lanzar error 400 si la fecha de inicio es inválida", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      const params = {
        especialidad: "esp1",
        fechaDesde: "no-es-una-fecha",
      };

      await expect(
        turnoService.buscarDisponibles(params),
      ).rejects.toMatchObject({
        statusCode: 400,
        codigo: "FECHA_INVALIDA",
      });
    });

    it("debe lanzar error 400 si fechaDesde es posterior a fechaHasta", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      const params = {
        especialidad: "esp1",
        fechaDesde: "2026-07-01",
        fechaHasta: "2026-06-01",
      };

      await expect(
        turnoService.buscarDisponibles(params),
      ).rejects.toMatchObject({
        statusCode: 400,
        codigo: "RANGO_FECHA_INVALIDO",
      });
    });

    it("debe lanzar error 400 si no se proporciona paciente", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      const params = { especialidad: "esp1" };

      await expect(
        turnoService.buscarDisponibles(params),
      ).rejects.toMatchObject({
        statusCode: 400,
        codigo: "PACIENTE_REQUERIDO",
      });
    });

    it("debe lanzar error 404 si el paciente no existe", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      mockPacienteRepository.findById.mockResolvedValue(null);
      const params = { especialidad: "esp1", paciente: "pac1" };

      // Act & Assert
      await expect(
        turnoService.buscarDisponibles(params),
      ).rejects.toMatchObject({
        statusCode: 404,
        codigo: "PACIENTE_NO_ENCONTRADO",
      });
    });

    // --- Búsquedas exitosas ---

    it("debe retornar turnos disponibles con paginación", async () => {
      // Arrange
      const turnosMock = [
        {
          _id: "turno1",
          medico: { nombre: "Dra. García", matricula: "MP-12345" },
          especialidad: { nombre: "Cardiología", costoConsulta: 5000 },
          fechaHora: new Date("2026-06-15T09:00:00"),
          estado: "DISPONIBLE",
          costo: 5000,
        },
        {
          _id: "turno2",
          medico: { nombre: "Dr. Pérez", matricula: "MP-67890" },
          especialidad: { nombre: "Cardiología", costoConsulta: 5000 },
          fechaHora: new Date("2026-06-16T10:00:00"),
          estado: "DISPONIBLE",
          costo: 5000,
        },
      ];

      mockEspecialidadRepository.findById.mockResolvedValue({
        _id: "esp1",
        nombre: "Cardiología",
      });
      mockTurnoRepository.buscarDisponibles.mockResolvedValue({
        turnos: turnosMock,
        total: 25,
      });
      mockPacienteRepository.findById.mockResolvedValue(pacienteMock);

      const params = {
        especialidad: "esp1",
        paciente: "pac1",
        page: 1,
        limit: 10,
      };

      const resultado = await turnoService.buscarDisponibles(params);

      expect(resultado.turnos).toHaveLength(2);
      expect(resultado.pagination).toEqual({
        total: 25,
        page: 1,
        limit: 10,
        totalPages: 3,
      });
      expect(mockTurnoRepository.buscarDisponibles).toHaveBeenCalledTimes(1);
    });

    it("debe calcular cobertura y costo estimado para el paciente", async () => {
      const turnosMock = [
        {
          _id: "turno1",
          medico: { nombre: "Dra. García", matricula: "MP-12345" },
          especialidad: {
            _id: "esp1",
            nombre: "Cardiología",
            costoConsulta: 1000,
          },
          fechaHora: new Date("2026-06-15T09:00:00"),
          estado: "DISPONIBLE",
          costo: 1000,
        },
      ];

      const pacienteConCobertura = {
        ...pacienteMock,
        plan: {
          nombre: "Plan 310",
          coberturasEspecialidad: [{ especialidad: "esp1", nivel: "PARCIAL" }],
          coberturasPractica: [],
        },
      };

      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      mockTurnoRepository.buscarDisponibles.mockResolvedValue({
        turnos: turnosMock,
        total: 1,
      });
      mockPacienteRepository.findById.mockResolvedValue(pacienteConCobertura);

      const params = { especialidad: "esp1", paciente: "pac1" };

      const resultado = await turnoService.buscarDisponibles(params);

      expect(resultado.turnos[0].cobertura).toBe("PARCIAL");
      expect(resultado.turnos[0].costoPaciente).toBe(500);
    });

    it("debe pasar los filtros correctamente al repositorio", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      mockMedicoRepository.findById.mockResolvedValue({ _id: "med1" });
      mockTurnoRepository.buscarDisponibles.mockResolvedValue({
        turnos: [],
        total: 0,
      });
      mockPacienteRepository.findById.mockResolvedValue(pacienteMock);

      const params = {
        especialidad: "esp1",
        paciente: "pac1",
        profesional: "med1",
        fechaDesde: "2026-06-01",
        fechaHasta: "2026-06-30",
        page: 2,
        limit: 5,
        sortBy: "costo",
        sortOrder: "desc",
      };

      await turnoService.buscarDisponibles(params);

      const [filtros, opciones] =
        mockTurnoRepository.buscarDisponibles.mock.calls[0];

      expect(filtros.especialidad).toBe("esp1");
      expect(filtros.medico).toBe("med1");
      expect(filtros.fechaDesde).toBe("2026-06-01");
      expect(filtros.fechaHasta).toBe("2026-06-30");
      expect(opciones.skip).toBe(5); // (page 2 - 1) * limit 5
      expect(opciones.limit).toBe(5);
      expect(opciones.sort).toEqual({ costo: -1 });
    });

    it("debe usar valores por defecto para paginación", async () => {
      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      mockTurnoRepository.buscarDisponibles.mockResolvedValue({
        turnos: [],
        total: 0,
      });
      mockPacienteRepository.findById.mockResolvedValue(pacienteMock);

      const params = { especialidad: "esp1", paciente: "pac1" };

      const resultado = await turnoService.buscarDisponibles(params);

      const [, opciones] = mockTurnoRepository.buscarDisponibles.mock.calls[0];
      expect(opciones.skip).toBe(0);
      expect(opciones.limit).toBe(10);
      expect(opciones.sort).toEqual({ fechaHora: 1 });
      expect(resultado.pagination.page).toBe(1);
      expect(resultado.pagination.limit).toBe(10);
    });

    it("debe limitar el máximo de resultados por página a 50", async () => {
      // Arrange
      mockEspecialidadRepository.findById.mockResolvedValue({ _id: "esp1" });
      mockTurnoRepository.buscarDisponibles.mockResolvedValue({
        turnos: [],
        total: 0,
      });
      mockPacienteRepository.findById.mockResolvedValue(pacienteMock);

      const params = { especialidad: "esp1", paciente: "pac1", limit: 1000 };

      const resultado = await turnoService.buscarDisponibles(params);

      
      expect(resultado.pagination.limit).toBe(50);
    });

    it("debe buscar por práctica sin especialidad", async () => {
   
      mockTurnoRepository.buscarDisponibles.mockResolvedValue({
        turnos: [],
        total: 0,
      });
      mockPacienteRepository.findById.mockResolvedValue(pacienteMock);

      const params = { practica: "prac1", paciente: "pac1" };

      const resultado = await turnoService.buscarDisponibles(params);

      const [filtros] = mockTurnoRepository.buscarDisponibles.mock.calls[0];
      expect(filtros.practica).toBe("prac1");
      expect(filtros.especialidad).toBeNull();
    });
  });
});
