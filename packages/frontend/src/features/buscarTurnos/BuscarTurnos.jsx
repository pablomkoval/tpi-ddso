import { useState } from 'react';
import { Box, Typography, Button, Drawer } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleChange = (campo, valor) => {
    setFiltrosPendientes((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAplicar = () => {
    if (!filtrosPendientes.especialidad) {
        //console.error("Cuidado aca en buscarTurnos.jsx");
        alert("Por favor, selecciona una especialidad/servicio para buscar.");
        return;
    }
    setFiltrosAplicados({ ...filtrosPendientes });
    setDrawerOpen(false);
  };

  const filtrosPanel = (
    <FiltrosBusqueda
      filtros={filtrosPendientes}
      onChange={handleChange}
      onAplicar={handleAplicar}
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      {/* Sidebar — solo desktop */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        {filtrosPanel}
      </Box>

      {/* Drawer — solo mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        {filtrosPanel}
      </Drawer>

      {/* Contenido principal */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, p: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setDrawerOpen(true)}
          >
            Filtros
          </Button>
        </Box>

        {filtrosAplicados ? (
          <TurnosResults filtros={filtrosAplicados} />
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
            }}
          >
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Por favor, seleccione una especialidad y aplique los filtros para iniciar la búsqueda de turnos.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BuscarTurnos;
