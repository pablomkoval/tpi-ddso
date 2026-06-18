import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  LocationOn as LocationIcon,
  PersonSearch as PersonSearchIcon,
  NotificationsNone as NotificationsNoneIcon,
  PendingActions as PendingActionsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../../utils/authUtils';

const proximoTurno = {
  especialidad: 'Cardiología Clínica',
  medico: 'Dr. Alberto Rodríguez',
  iniciales: 'AR',
  fecha: 'Sábado, 20 de Junio',
  fechaLabel: 'Fecha confirmada',
  hora: '10:00 AM',
  duracion: '30 min',
  lugar: 'Sede Central - Banfield',
  ciudad: 'Buenos Aires, Argentina',
};

const turnosPendientes = [
  { id: 1, especialidad: 'Dermatología', estado: 'Esperando confirmación médica' },
  { id: 2, especialidad: 'Laboratorio', estado: 'Solicitud enviada hoy' },
];

const datosNotificaciones = {
  count: 3,
  mensaje: 'Su último estudio de laboratorio ya está disponible para descargar.',
};

export default function DashboardPaciente() {
  const username = getUsernameFromToken();
  const navigate = useNavigate();

  const nombreCompleto = username ? username : 'Paciente';

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Hola, {nombreCompleto}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bienvenido a su portal de salud. Aquí podrá gestionar sus turnos y registros médicos.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonSearchIcon />}
          onClick={() => navigate('/buscar-turnos')}
          sx={{ flexShrink: 0 }}
        >
          Buscar turno
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
          gap: 3,
        }}
      >
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Chip
              label="Próximo Turno"
              size="small"
              sx={{
                mb: 2.5,
                bgcolor: 'primary.light',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                  {proximoTurno.especialidad}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {proximoTurno.medico}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                {proximoTurno.iniciales}
              </Avatar>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: { xs: 2, md: 5 }, flexWrap: 'wrap' }}>
              <InfoItem
                icon={<CalendarIcon />}
                main={proximoTurno.fecha}
                sub={proximoTurno.fechaLabel}
              />
              <InfoItem
                icon={<ClockIcon />}
                main={proximoTurno.hora}
                sub={`Duración: ${proximoTurno.duracion}`}
              />
              <InfoItem
                icon={<LocationIcon />}
                main={proximoTurno.lugar}
                sub={proximoTurno.ciudad}
              />
            </Box>
          </CardContent>
        </Card>

        <Stack spacing={2.5}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PendingActionsIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                  <Typography variant="body1" fontWeight={700}>
                    Turnos Pendientes
                  </Typography>
                </Box>
                <Chip
                  label={turnosPendientes.length}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700, minWidth: 28 }}
                />
              </Box>

              <Stack spacing={1.5}>
                {turnosPendientes.map((t) => (
                  <Box
                    key={t.id}
                    sx={{ bgcolor: 'background.default', borderRadius: 2, p: 1.5 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {t.especialidad}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.estado}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: 'primary.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <NotificationsNoneIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 20 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                  }}
                >
                  Notificaciones
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
                {datosNotificaciones.count} Nuevos mensajes
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.8)', mb: 2.5, lineHeight: 1.5 }}
              >
                {datosNotificaciones.mensaje}
              </Typography>

              <Button
                variant="contained"
                onClick={() => navigate('/notificaciones')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: 'primary.light', boxShadow: 'none' },
                }}
              >
                Ver todas
              </Button>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}

function InfoItem({ icon, main, sub }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
          {main}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {sub}
        </Typography>
      </Box>
    </Box>
  );
}