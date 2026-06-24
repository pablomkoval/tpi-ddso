import { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, Pagination, Skeleton } from '@mui/material';
import TurnoCard from './TurnoCard.jsx';
import { detalleTurnosData } from '../../mockdata/detalleTurnosData.js';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

const LIMITE = 10; //Revisar hardcodeo aca

const filtrarTurnos = (turnos, filtros) => {
  return turnos.filter((t) => {
    if (filtros.profesional && !t.nombre.toLowerCase().includes(filtros.profesional.toLowerCase()))
      return false;
    if (filtros.especialidad && t.especialidad.toLowerCase() !== filtros.especialidad.toLowerCase())
      return false;
    if (filtros.sedes?.length > 0 && !filtros.sedes.includes(t.sede))
      return false;
    return true;
  });
};

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPagina(1);
    setLoading(1);
    // TODO: reemplazar con fetch real:
    // fetch(`/api/turnos?${new URLSearchParams(filtros)}`).then(...)
    
    // para el skeleton
    const timer = setTimeout(() => {
      const filtrados = filtrarTurnos(detalleTurnosData, filtros); 
      setTurnos(filtrados);
      setTotal(filtrados.length);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [filtros]);

  const turnosOrdenados = ordenarTurnos(turnos, orden);

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Turnos Disponibles</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {/* Si esta cargando se muestra un skeleton para conteo*/}
            {loading ? <Skeleton width={250} /> : `Se encontraron ${total} turnos que coinciden con su búsqueda.`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Ordenar por:</Typography>
          <FormControl size="small">
            <Select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              sx={{ minWidth: 160 }}
              disabled={loading}
            >
              {ordenarOpciones.map((op) => (
                <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <CustomSkeleton type="list" count={3} />
        ) : (
          turnosOrdenados.map((turno) => (
            <TurnoCard key={turno.id} turno={turno} />
          ))
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(total / LIMITE)}
          page={pagina}
          onChange={(_, p) => setPagina(p)}
          color="primary"
          disabled={loading}
        />
      </Box>
    </Box>
  );
};

export default TurnosResults;