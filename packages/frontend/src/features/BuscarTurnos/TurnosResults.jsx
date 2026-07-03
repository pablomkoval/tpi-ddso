import { useState, useEffect } from 'react';
import { Box, Typography, Pagination, Skeleton } from '@mui/material';
import TurnoCard from './TurnoCard.jsx';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';
import { buscarTurnos } from '../../services/busquedaTurnosService.js';

const LIMITE = 10; //Revisar hardcodeo aca

const TurnosResults = ({ filtros = {} }) => {
  const [turnos, setTurnos] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorApi, setErrorApi] = useState(false);

  // Cada vez que cambian los filtros, arrancamos de nuevo desde la página 1.
  useEffect(() => {
    setPagina(1);
  }, [filtros]);

  useEffect(() => {
    const cargarTurnos = async () => {
      setLoading(true);
      setErrorApi(false);

      try {
        const { turnos: turnosObtenidos, pagination } = await buscarTurnos(filtros, pagina, LIMITE);

        setTurnos(turnosObtenidos);
        setTotal(pagination.totalTurnos);
        setTotalPaginas(pagination.totalPaginas);
      } catch (e) {
        setTurnos([]);
        setTotal(0);
        setTotalPaginas(0);
        setErrorApi(true);
      } finally {
        setLoading(false);
      }
    };

    cargarTurnos();
  }, [filtros, pagina]);

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
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <CustomSkeleton type="list" count={3} />
        ) : (
          turnos.map((turno) => (
            <TurnoCard key={turno.id} turno={turno} />
          ))
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPaginas}
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