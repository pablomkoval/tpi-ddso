import axios from 'axios';
import { buscarMedicos } from './filtrosBusquedaService';

jest.mock('axios');

describe('buscarMedicos', () => {
  it('filtra médicos por la especialidad usando el identificador de servicio', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          id: 'med-1',
          nombre: 'Dr. Ana Rivas',
          especialidades: [{ _id: 'esp-rel-1', servicioUnico: 'esp-1' }],
        },
        {
          id: 'med-2',
          nombre: 'Dr. Martín Sosa',
          especialidades: [{ _id: 'esp-rel-2', servicioUnico: 'esp-2' }],
        },
      ],
    });

    const medicos = await buscarMedicos('esp-1');

    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/medicos?servicioId=esp-1');
    expect(medicos).toEqual([
      { id: 'med-1', nombre: 'Dr. Ana Rivas' },
      { id: 'med-2', nombre: 'Dr. Martín Sosa' },
    ]);
  });
});
