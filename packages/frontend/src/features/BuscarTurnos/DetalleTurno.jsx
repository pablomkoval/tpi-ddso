import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerTurnoPorId } from '../../services/busquedaTurnosService.js';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  PersonSearch as PersonSearchIcon,
} from '@mui/icons-material';


export default function DetalleTurno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [turno, setTurno] = useState(null);

  const fetchTurno = async (id) => {
    try {
      const turnoData = await obtenerTurnoPorId(id);
      console.log("Turno obtenido:", turnoData);
      setTurno(turnoData);
    } catch (error) {
      console.error("Error al obtener el turno por ID:", error);
    } finally {
      setLoading(false);
    }
  };

  // para el skeleton
  useEffect(() => {
    fetchTurno(id);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
        <CustomSkeleton type="detail" count={1} />
      </Box>
    );
  }

  if (!turno) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No se encontró el turno solicitado.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate('/buscar-turnos')}
        >
          Volver a resultados
        </Button>
      </Box>
    );
  }

  const fecha = new Date(turno.fechaHora);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/buscar-turnos')}
        sx={{ mb: 2 }}
      >
        Volver a resultados
      </Button>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {turno.servicio?.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {turno.servicio?.tipo} · {turno.servicio?.duracionMinutos} min
              </Typography>
            </Box>
            <Chip label={turno.estado} color="primary" variant="outlined" />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <SeccionHeader icon={<CalendarIcon fontSize="small" />} label="Fecha y hora" color="primary.main" />
          <Typography sx={{ mb: 2 }}>
            {fecha.toLocaleDateString('es-AR')} - {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </Typography>

          <SeccionHeader icon={<PersonSearchIcon fontSize="small" />} label="Médico" color="primary.main" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar>{turno.medico?.nombre?.charAt(0)}</Avatar>
            <Typography>{turno.medico?.nombre}</Typography>
          </Box>

          <SeccionHeader icon={<LocationIcon fontSize="small" />} label="Sede" color="primary.main" />
          <Typography sx={{ mb: 2 }}>
            {turno.sede?.nombre} - {turno.sede?.direccion}
          </Typography>

          <SeccionHeader icon={<CreditCardIcon fontSize="small" />} label="Costo" color="primary.main" />
          <Typography sx={{ mb: 2 }}>${turno.costo}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function SeccionHeader({ icon, label, color }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
      <Box sx={{ color, display: 'flex' }}>{icon}</Box>
      <Typography
        variant="caption"
        sx={{ color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}
      >
        {label}
      </Typography>
    </Box>
  );
}