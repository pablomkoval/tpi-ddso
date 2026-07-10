import { render, waitFor } from '@testing-library/react';
import FiltrosBusqueda from '../src/features/BuscarTurnos/FiltrosBusqueda';
import {
  buscarServicios,
  buscarMedicos,
  buscarSedes,
} from '../src/services/filtrosBusquedaService';

jest.mock('../src/services/filtrosBusquedaService', () => ({
  buscarServicios: jest.fn(),
  buscarMedicos: jest.fn(),
  buscarSedes: jest.fn(),
}));

describe('FiltrosBusqueda', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no consulta médicos hasta que haya un servicio seleccionado', async () => {
    buscarServicios.mockResolvedValue([{ id: 'esp-1', nombre: 'Cardiología' }]);
    buscarSedes.mockResolvedValue([{ id: 'sede-1', nombre: 'Sede Norte' }]);
    buscarMedicos.mockResolvedValue([{ id: 'med-1', nombre: 'Dr. López' }]);

    const { rerender } = render(
      <FiltrosBusqueda
        filtros={{
          servicio: '',
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

    await waitFor(() => expect(buscarServicios).toHaveBeenCalledTimes(1));
    expect(buscarMedicos).not.toHaveBeenCalled();

    rerender(
      <FiltrosBusqueda
        filtros={{
          servicio: 'esp-1',
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
