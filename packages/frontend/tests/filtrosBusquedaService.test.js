import axios from 'axios';
import { buscarMedicos } from '../src/services/filtrosBusquedaService';

jest.mock('axios');

describe('buscarMedicos', () => {
  it('envía el servicio seleccionado al endpoint de médicos', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: [
          { id: 'med-1', nombre: 'Dr. Ana Rivas' },
          { id: 'med-2', nombre: 'Dr. Martín Sosa' },
        ],
      },
    });

    const medicos = await buscarMedicos('esp-1');

    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/medicos?servicioId=esp-1');
    expect(medicos).toEqual([
      { id: 'med-1', nombre: 'Dr. Ana Rivas' },
      { id: 'med-2', nombre: 'Dr. Martín Sosa' },
    ]);
  });
});
