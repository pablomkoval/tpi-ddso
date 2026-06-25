import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Stack } from '@mui/material';
import TurnoCard from './TurnoCard';
import { misTurnosData } from '../../mockdata/misTurnosData';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

const ahora = new Date();
const proximos = misTurnosData.filter((t) => new Date(t.fechaHora) >= ahora);
const historial = misTurnosData.filter((t) => new Date(t.fechaHora) < ahora);

export default function MisTurnos() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  //para el skeleton :<
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [tab]);

  const turnos = tab === 0 ? proximos : historial;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 0.5 }}>
        Mis Turnos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Administre sus citas médicas y visualice su historial.
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Próximos Turnos" disabled={loading} />
        <Tab label="Historial" disabled={loading} />
      </Tabs>

      {/*si esta cargando, muestra el skeleton*/}
      {loading ? (
        <Stack spacing={2}>
          <CustomSkeleton type="list" count={3} />
        </Stack>
      ) : turnos.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No hay turnos para mostrar.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {turnos.map((turno) => (
            <TurnoCard
              key={turno.id}
              turno={turno}
              onPedirCambio={() => console.log('Pedir cambio', turno.id)}
              onCancelar={() => console.log('Cancelar', turno.id)}
              onDeshacerSolicitud={() => console.log('Deshacer solicitud', turno.id)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}