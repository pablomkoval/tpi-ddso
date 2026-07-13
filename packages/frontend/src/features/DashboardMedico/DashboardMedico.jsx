import React, { useEffect, useState } from 'react';
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
  PersonSearch as PersonSearchIcon,
  EventAvailable as EventAvailableIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  NotificationsNone as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromToken } from '../../utils/authUtils';
import { obtenerResumenNotificaciones } from '../../services/notificacionesService.js';
import { getMiMedico, getAgenda } from '../../services/medicoService.js';
import { ZONA_HORARIA_ARGENTINA, obtenerPartesEnZonaArgentina } from '../../utils/dateUtils.js';

const estadoConfig = {
  realizado: { label: 'Realizado', color: 'success' },
  confirmado: { label: 'Confirmado', color: 'primary' },
  reservado: { label: 'Pendiente', color: 'warning' },
};

const horaAMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

const formatearTiempoRestante = (minutosRestantes) => {
  if (minutosRestantes <= 0) return 'En curso';
  const horas = Math.floor(minutosRestantes / 60);
  const minutos = minutosRestantes % 60;
  if (horas === 0) return `En ${minutos} min`;
  if (minutos === 0) return `En ${horas} hora${horas > 1 ? 's' : ''}`;
  return `En ${horas} hora${horas > 1 ? 's' : ''} ${minutos} min`;
};

export default function DashboardMedico() {
  const username = getUsernameFromToken();
  const navigate = useNavigate();
  const [resumenNotificaciones, setResumenNotificaciones] = useState({
    total: 0,
    leidas: 0,
    noLeidas: 0,
  });
  const [turnosHoy, setTurnosHoy] = useState([]);

  useEffect(() => {
    const cargarResumenNotificaciones = async () => {
      try {
        const data = await obtenerResumenNotificaciones();
        setResumenNotificaciones(data);
      } catch (error) {
        console.error("Error cargando resumen de notificaciones", error);
      }
    };

    cargarResumenNotificaciones();
  }, []);

  useEffect(() => {
    const cargarTurnosDeHoy = async () => {
      try {
        const medico = await getMiMedico();
        const medicoId = medico.id || medico._id;

        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);

        const agendaData = await getAgenda(medicoId, inicioDia.toISOString(), finDia.toISOString());

        const turnosDeHoy = agendaData
          .filter((turno) => {
            const estado = turno.estado.toLowerCase();
            return estado !== 'disponible' && estado !== 'cancelado';
          })
          .map((turno) => {
            const fecha = new Date(turno.fechaHora);
            return {
              id: turno.id || turno._id,
              paciente: turno.pacienteDetalle?.nombre || 'Paciente',
              motivo: turno.servicio?.nombre || turno.servicio?.servicioUnico?.nombre || 'Consulta general',
              hora: fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONA_HORARIA_ARGENTINA }),
              estado: turno.estado.toLowerCase(),
            };
          })
          .sort((a, b) => horaAMinutos(a.hora) - horaAMinutos(b.hora));

        setTurnosHoy(turnosDeHoy);
      } catch (error) {
        console.error("Error cargando turnos de hoy", error);
      }
    };

    cargarTurnosDeHoy();
  }, []);

  const nombreCompleto = username ? username : 'Médico';

  const partesAhora = obtenerPartesEnZonaArgentina(new Date());
  const ahoraEnMinutos = partesAhora.hora * 60 + partesAhora.minuto;
  const proximoTurno = [...turnosHoy]
    .sort((a, b) => horaAMinutos(a.hora) - horaAMinutos(b.hora))
    .find((t) => horaAMinutos(t.hora) >= ahoraEnMinutos) ?? null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>

      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Hola, {nombreCompleto}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Panel médico · {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: ZONA_HORARIA_ARGENTINA })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<EventAvailableIcon />}
            onClick={() => navigate('/definir-disponibilidad')}
          >
            Disponibilidad
          </Button>
          <Button
            variant="contained"
            startIcon={<CalendarIcon />}
            onClick={() => navigate('/agenda-medica')}
          >
            Ver Agenda
          </Button>
        </Box>
      </Box>

<<<<<<< Updated upstream
=======
      {/* Stats rápidas */}
      {/* <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard icon={<CheckCircleIcon />} iconColor="#2e7d32" bg="#e8f5e9" value={dashboardStats.atendidosMes} label="Atendidos este mes" />
        <StatCard icon={<CalendarIcon />}    iconColor="#1565c0" bg="#e3f2fd" value={dashboardStats.proximasCitas} label="Próximas citas"      />
        <StatCard icon={<PendingIcon />}     iconColor="#e65100" bg="#fff3e0" value={resumenNotificaciones.noLeidas}  label="Cambios solicitados" />
        <StatCard icon={<ClockIcon />}       iconColor="#6a1b9a" bg="#f3e5f5" value={dashboardStats.turnosHoy}  label="Turnos de hoy"       />
      </Box> */}

>>>>>>> Stashed changes
      {/* Cuerpo principal */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 320px' }, gap: 3 }}>

        {/* Turnos de hoy */}
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" fontWeight={700}>Turnos de hoy: {dashboardStats.turnosHoy}</Typography>
              <Button size="small" onClick={() => navigate('/agenda-medica')}>Ver agenda completa</Button>
            </Box>

            {turnosHoy.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tienes turnos programados para hoy.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {turnosHoy.map((t) => {
                  const cfg = estadoConfig[t.estado];
                  return (
                    <Box
                      key={t.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700, fontSize: '0.85rem' }}>
                        {t.paciente.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{t.paciente}</Typography>
                        <Typography variant="caption" color="text.secondary">{t.motivo}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        <Typography variant="body2" fontWeight={600}>{t.hora}</Typography>
                        <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 600 }} />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}

          </CardContent>
        </Card>

        {/* Panel lateral */}
        <Stack spacing={2.5}>

          {/* Próximo turno */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ClockIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body1" fontWeight={700}>Próximo turno</Typography>
              </Box>
              {proximoTurno ? (
                <>
                  <Typography variant="h6" fontWeight={700}>
                    {proximoTurno.paciente}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {proximoTurno.motivo}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {proximoTurno.hora}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatearTiempoRestante(horaAMinutos(proximoTurno.hora) - ahoraEnMinutos)}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No tienes más turnos programados para hoy.
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card sx={{ bgcolor: 'primary.main' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <NotificationsIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 20 }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Notificaciones
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
                {resumenNotificaciones.noLeidas} Notificaciones no leídas
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2.5, lineHeight: 1.5 }}>
                {resumenNotificaciones.noLeidas > 0
                  ? "Tenés solicitudes y avisos pendientes de revisión."
                  : "No tenés notificaciones pendientes."}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/notificaciones')}
                sx={{ bgcolor: 'white', color: 'primary.main', boxShadow: 'none', '&:hover': { bgcolor: 'primary.light', boxShadow: 'none' } }}
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

function StatCard({ icon, iconColor, bg, value, label }) {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
        <Avatar sx={{ bgcolor: bg, color: iconColor, width: 44, height: 44 }}>{icon}</Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
