import { useState } from 'react';
import { Box } from '@mui/material';
import TurnosResults from './TurnosResults.jsx';
import FiltrosBusqueda from './FiltrosBusqueda.jsx';

const FILTROS_INICIALES = {
  profesional: '',
  especialidad: '',
  consultorio: '',
  sedes: [],
  fechaDesde: '',
  fechaHasta: '',
};

const BuscarTurnos = () => {
  const [filtrosPendientes, setFiltrosPendientes] = useState(FILTROS_INICIALES);
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES);

  const handleChange = (campo, valor) => {
    setFiltrosPendientes((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAplicar = () => {
    setFiltrosAplicados({ ...filtrosPendientes });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      <FiltrosBusqueda
        filtros={filtrosPendientes}
        onChange={handleChange}
        onAplicar={handleAplicar}
      />
      <TurnosResults filtros={filtrosAplicados} />
    </Box>
  );
};

export default BuscarTurnos;