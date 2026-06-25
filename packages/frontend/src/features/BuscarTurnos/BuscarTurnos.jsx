import { useState } from 'react';
import { Box } from '@mui/material';
import TurnosResults from './TurnosResults.jsx';
import FiltrosBusqueda from './FiltrosBusqueda.jsx';

const FILTROS_INICIALES = {
  profesional: '',
  sede: '',
  especialidad: '',
  fechaDesde: '',
  fechaHasta: '',
  sortBy: '',
  sortOrder: '',
};

const BuscarTurnos = () => {
  const [filtrosPendientes, setFiltrosPendientes] = useState(FILTROS_INICIALES);
  const [filtrosAplicados, setFiltrosAplicados] = useState(FILTROS_INICIALES);

  const handleChange = (campo, valor) => {
    setFiltrosPendientes((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAplicar = () => {
    if (!filtrosPendientes.especialidad) {
        alert("Por favor, selecciona una especialidad/servicio para buscar.");
        return;
    }
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