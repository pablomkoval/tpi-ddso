import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerTurnoPorId } from '../../services/busquedaTurnosService.js';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';
import { formatearFecha, formatearHora } from '../../utils/dateUtils.js';
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
  EventAvailable as EventAvailableIcon,
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/buscar-turnos')}
        sx={{ mb: 2 }}
      >
        Volver a resultados
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {turno.servicio?.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {turno.servicio?.tipo} · {turno.servicio?.duracionMinutos} min
              </Typography>
            </Box>
            <Chip label={turno.estado} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <InfoCard icon={<CalendarIcon />} label="Fecha y hora">
              {formatearFecha(turno.fechaHora)} - {formatearHora(turno.fechaHora)}
            </InfoCard>

            <InfoCard icon={<PersonSearchIcon />} label="Médico">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                  {turno.medico?.nombre?.charAt(0)}
                </Avatar>
                {turno.medico?.nombre}
              </Box>
            </InfoCard>

            <InfoCard icon={<LocationIcon />} label="Sede">
              {turno.sede?.nombre} - {turno.sede?.direccion}
            </InfoCard>

            <InfoCard icon={<CreditCardIcon />} label="Costo">
              ${turno.costo}
            </InfoCard>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EventAvailableIcon />}
            >
              Reservar turno
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function InfoCard({ icon, label, children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 2,
        borderRadius: 2,
        bgcolor: 'action.hover',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontWeight: 500 }}>{children}</Typography>
      </Box>
    </Box>
  );
}