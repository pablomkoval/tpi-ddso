import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, Pagination } from '@mui/material';
import TurnoCard from './TurnoCard.jsx';

const LIMITE = 10;

const turnosMock = [
  { id: 1, nombre: 'Dr. Juan Pérez',   especialidad: 'CARDIOLOGÍA',  fecha: '15/06/2026', hora: '15:30', sede: 'Sede Palermo',  estado: 'Parcial',  precio: 3500 },
  { id: 2, nombre: 'Dra. Elena Rossi', especialidad: 'CARDIOLOGÍA',  fecha: '16/06/2026', hora: '10:00', sede: 'Sede Palermo',  estado: 'Completa', precio: 4200 },
  { id: 3, nombre: 'Dr. Marcos Silva', especialidad: 'NEUROLOGÍA',   fecha: '17/06/2026', hora: '09:00', sede: 'Sede Belgrano', estado: 'Parcial',  precio: 2800 },
  { id: 4, nombre: 'Dra. Laura Gómez', especialidad: 'DERMATOLOGÍA', fecha: '18/06/2026', hora: '14:00', sede: 'Sede Centro',   estado: 'Completa', precio: 3100 },
];

const ordenarOpciones = [
  { value: 'precio_asc',  label: 'Menor Precio' },
  { value: 'precio_desc', label: 'Mayor Precio' },
  { value: 'fecha_asc',   label: 'Fecha más próxima' },
];

const ordenarTurnos = (turnos, criterio) => {
  const copia = [...turnos];
  if (criterio === 'precio_asc')  return copia.sort((a, b) => a.precio - b.precio);
  if (criterio === 'precio_desc') return copia.sort((a, b) => b.precio - a.precio);
  return copia;
};

const TurnosResults = ({ filtros = {} }) => {
  const [turnos, setTurnos] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [orden, setOrden] = useState('precio_asc');

  const cargarTurnos = useCallback((paginaActual) => {
    // TODO: reemplazar con fetch real cuando el backend tenga paginación:
    // fetch(`/api/turnos?pagina=${paginaActual}&limite=${LIMITE}&${new URLSearchParams(filtros)}`)
    //   .then(res => res.json())
    //   .then(({ data, total }) => { setTurnos(data); setTotal(total); });
    setTurnos(turnosMock);
    setTotal(turnosMock.length);
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [filtros]);

  useEffect(() => {
    cargarTurnos(pagina);
  }, [pagina, cargarTurnos]);

  const turnosOrdenados = ordenarTurnos(turnos, orden);

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Turnos Disponibles</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Se encontraron {total} turnos que coinciden con su búsqueda.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Ordenar por:</Typography>
          <FormControl size="small">
            <Select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              {ordenarOpciones.map((op) => (
                <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {turnosOrdenados.map((turno) => (
          <TurnoCard key={turno.id} turno={turno} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(total / LIMITE)}
          page={pagina}
          onChange={(_, p) => setPagina(p)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default TurnosResults;