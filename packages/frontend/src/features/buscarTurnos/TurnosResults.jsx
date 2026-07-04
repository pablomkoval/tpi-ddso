import { useState, useEffect } from 'react';
import { Box, Typography, Pagination, Skeleton } from '@mui/material';
import TurnoCard from './TurnoCard.jsx';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';
import { buscarTurnos } from '../../services/busquedaTurnosService.js';

const LIMITE = 10;

const PAGINATION_INICIAL = {
  totalTurnos: 0,
  page: 1,
  limit: LIMITE,
  totalPaginas: 0,
};

const TurnosResults = ({ filtros = {} }) => {
  const [turnos, setTurnos] = useState([]);
  const [pagination, setPagination] = useState(PAGINATION_INICIAL);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorApi, setErrorApi] = useState(false);

  useEffect(() => {
    setPagina(1);
  }, [filtros]);

  useEffect(() => {
    const cargarTurnos = async () => {
      setLoading(true);
      setErrorApi(false);

      try {
        const resultado = await buscarTurnos({
          ...filtros,
          page: pagina,
          limit: LIMITE,
        });

        setTurnos(resultado.turnos || []);
        setPagination(resultado.pagination || PAGINATION_INICIAL);
      } catch (e) {
        setTurnos([]);
        setPagination(PAGINATION_INICIAL);
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
            {loading ? (
              <Skeleton width={250} />
            ) : (
              `Se encontraron ${pagination.totalTurnos} turnos que coinciden con su busqueda.`
            )}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <CustomSkeleton type="list" count={3} />
        ) : errorApi ? (
          <Typography color="error">No se pudieron cargar los turnos.</Typography>
        ) : turnos.length === 0 ? (
          <Typography color="text.secondary">
            No hay turnos disponibles para los filtros seleccionados.
          </Typography>
        ) : (
          turnos.map((turno) => (
            <TurnoCard key={turno.id} turno={turno} />
          ))
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={pagination.totalPaginas}
          page={pagina}
          onChange={(_, p) => setPagina(p)}
          color="primary"
          disabled={loading || pagination.totalPaginas <= 1}
        />
      </Box>
    </Box>
  );
};

export default TurnosResults;
