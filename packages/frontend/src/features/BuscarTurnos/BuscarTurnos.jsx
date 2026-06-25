import { useState } from 'react';
import { Box, Typography } from '@mui/material';
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
  const [filtrosAplicados, setFiltrosAplicados] = useState(null);

  const handleChange = (campo, valor) => {
    setFiltrosPendientes((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAplicar = () => {
    if (!filtrosPendientes.especialidad) {
        console.error("Cuidado aca en buscarTurnos.jsx");
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

      {filtrosAplicados ? (
        <TurnosResults filtros={filtrosAplicados} />
      ) : (
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: 4 
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Por favor, seleccione una especialidad y aplique los filtros para iniciar la búsqueda de turnos.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BuscarTurnos;