import { render, waitFor } from '@testing-library/react';
import FiltrosBusqueda from './FiltrosBusqueda';
import {
  buscarEspecialidades,
  buscarMedicos,
  buscarSedes,
} from '../../services/filtrosBusquedaService';

jest.mock('../../services/filtrosBusquedaService', () => ({
  buscarEspecialidades: jest.fn(),
  buscarMedicos: jest.fn(),
  buscarSedes: jest.fn(),
}));

describe('FiltrosBusqueda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no consulta médicos hasta que haya una especialidad seleccionada', async () => {
    buscarEspecialidades.mockResolvedValue([{ id: 'esp-1', nombre: 'Cardiología' }]);
    buscarSedes.mockResolvedValue([{ id: 'sede-1', nombre: 'Sede Norte' }]);
    buscarMedicos.mockResolvedValue([{ id: 'med-1', nombre: 'Dr. López' }]);

    const { rerender } = render(
      <FiltrosBusqueda
        filtros={{
          especialidad: '',
          profesional: '',
          sede: '',
          fechaDesde: '',
          fechaHasta: '',
          sortBy: '',
          sortOrder: '',
        }}
        onChange={jest.fn()}
        onAplicar={jest.fn()}
      />
    );

    await waitFor(() => expect(buscarEspecialidades).toHaveBeenCalledTimes(1));
    expect(buscarMedicos).not.toHaveBeenCalled();

    rerender(
      <FiltrosBusqueda
        filtros={{
          especialidad: 'esp-1',
          profesional: '',
          sede: '',
          fechaDesde: '',
          fechaHasta: '',
          sortBy: '',
          sortOrder: '',
        }}
        onChange={jest.fn()}
        onAplicar={jest.fn()}
      />
    );

    await waitFor(() => expect(buscarMedicos).toHaveBeenCalledWith('esp-1'));
  });
});
