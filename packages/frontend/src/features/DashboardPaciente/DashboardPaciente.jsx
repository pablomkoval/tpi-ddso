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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../../utils/authUtils';
import { obtenerResumenNotificaciones } from '../../services/notificacionesService.js';
import { getMiPaciente } from '../../services/pacienteService.js';
import { obtenerTurnosPorPaciente } from '../../services/busquedaTurnosService.js';

const estadoPendienteLabel = {
  reservado: 'Esperando confirmación médica',
  confirmado: 'Confirmado',
};

const mapearTurno = (turno) => {
  const fechaHora = new Date(turno.fechaHora);
  const nombreMedico = turno.medico?.nombre || '';
  return {
    id: turno.id,
    especialidad: turno.servicio?.nombre || 'Consulta general',
    medico: nombreMedico ? `Dr. ${nombreMedico}` : 'Médico a confirmar',
    iniciales: nombreMedico
      ? nombreMedico.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
      : '??',
    fecha: fechaHora.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }),
    fechaLabel: turno.estado.toLowerCase() === 'confirmado' ? 'Fecha confirmada' : 'Pendiente de confirmación',
    hora: fechaHora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }),
    duracion: `${turno.servicio?.duracionMinutos || 30} min`,
    lugar: turno.sede?.nombre || 'Sede a confirmar',
    ciudad: turno.sede?.direccion || '',
    estado: turno.estado.toLowerCase(),
    fechaHoraDate: fechaHora,
  };
};

export default function DashboardPaciente() {

  const [proximoTurno, setProximoTurno] = useState(null);
  const [turnosPendientes, setTurnosPendientes] = useState([]);
  const [datosNotificaciones, setNotificaciones] = useState(null);
  const [cargandoTurnos, setCargandoTurnos] = useState(true);

  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        const paciente = await getMiPaciente();
        const pacienteId = paciente.id || paciente._id;

        const turnos = await obtenerTurnosPorPaciente(pacienteId);
        const ahora = new Date();

        const turnosFuturos = turnos
          .filter((t) => {
            const estado = t.estado.toLowerCase();
            return (estado === 'reservado' || estado === 'confirmado') && new Date(t.fechaHora) >= ahora;
          })
          .map(mapearTurno)
          .sort((a, b) => a.fechaHoraDate - b.fechaHoraDate);

        setProximoTurno(turnosFuturos[0] || null);
        setTurnosPendientes(turnosFuturos.slice(1));
      } catch (error) {
        console.error("Error cargando turnos del paciente", error);
        setProximoTurno(null);
        setTurnosPendientes([]);
      } finally {
        setCargandoTurnos(false);
      }
    };

    cargarTurnos();

    const cargarResumenNotificaciones = async () => {
      try {
        const data = await obtenerResumenNotificaciones();
        setNotificaciones(data);
      } catch (error) {
        console.error("Error cargando resumen de notificaciones", error);
        setNotificaciones({
          total: 0,
          leidas: 0,
          noLeidas: 0,
        });
      }
    };

    cargarResumenNotificaciones();
  }, []);

  const username = getUsernameFromToken();
  const navigate = useNavigate();

  const nombreCompleto = username ? username : 'Paciente';

  if (cargandoTurnos || !datosNotificaciones) {
    return <div>Cargando...</div>;
  }

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

            {proximoTurno ? (
              <>
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
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tenés turnos programados próximamente.
              </Typography>
            )}
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
                {turnosPendientes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No tenés turnos pendientes.
                  </Typography>
                ) : (
                  turnosPendientes.map((t) => (
                    <Box
                      key={t.id}
                      sx={{ bgcolor: 'background.default', borderRadius: 2, p: 1.5 }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {t.especialidad}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {estadoPendienteLabel[t.estado] || t.estado}
                      </Typography>
                    </Box>
                  ))
                )}
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
                {datosNotificaciones.noLeidas} Notificaciones no leídas
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.8)', mb: 2.5, lineHeight: 1.5 }}
              >
                {datosNotificaciones.noLeidas > 0
                  ? "Tenés notificaciones pendientes para revisar."
                  : "No tenés notificaciones pendientes."}
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
