import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerTurnoPorId } from '../../services/busquedaTurnosService.js';
import { getMiPaciente, reservarTurno } from '../../services/pacienteService.js';
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
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  Person as PersonIcon,
  EventAvailable as EventAvailableIcon,
  AccessTime as ClockIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';

const ESTADO_CONFIG = {
  DISPONIBLE:  { label: 'Disponible',  color: 'success' },
  RESERVADO:   { label: 'Reservado',   color: 'warning' },
  CONFIRMADO:  { label: 'Confirmado',  color: 'primary' },
  CANCELADO:   { label: 'Cancelado',   color: 'error'   },
  REALIZADO:   { label: 'Realizado',   color: 'default' },
  COMPLETADO:  { label: 'Completado',  color: 'default' },
};

export default function DetalleTurno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]       = useState(true);
  const [turno, setTurno]           = useState(null);
  const [paciente, setPaciente]     = useState(null);
  const [errorCarga, setErrorCarga] = useState(null);

  // Reserva
  const [reservando, setReservando]     = useState(false);
  const [errorReserva, setErrorReserva] = useState(null);
  const [snackbar, setSnackbar]         = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setErrorCarga(null);
      try {
        // Cargar el turno y el perfil del paciente en paralelo
        const [turnoData, pacienteData] = await Promise.all([
          obtenerTurnoPorId(id),
          getMiPaciente(),
        ]);
        setTurno(turnoData);
        setPaciente(pacienteData);
      } catch (error) {
        console.error('Error al cargar detalle del turno:', error);
        setErrorCarga('No se pudo cargar el detalle del turno. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  const handleReservar = async () => {
    if (!paciente || !turno) return;
    setReservando(true);
    setErrorReserva(null);
    try {
      const pacienteId = paciente._id || paciente.id;
      const turnoId    = turno.id || turno._id;
      await reservarTurno(pacienteId, turnoId);
      setSnackbar({ open: true, message: '¡Turno reservado con éxito! Podés verlo en Mis Turnos.', severity: 'success' });
      // Recargar para mostrar el estado actualizado
      const turnoActualizado = await obtenerTurnoPorId(id);
      setTurno(turnoActualizado);
    } catch (e) {
      const msg = e?.response?.data?.message || 'No se pudo reservar el turno. Intente nuevamente.';
      setErrorReserva(msg);
    } finally {
      setReservando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
        <CustomSkeleton type="detail" count={1} />
      </Box>
    );
  }

  if (errorCarga || !turno) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {errorCarga || 'No se encontró el turno solicitado.'}
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

  const estadoConfig   = ESTADO_CONFIG[turno.estado] ?? { label: turno.estado, color: 'default' };
  const estaDisponible = turno.estado === 'DISPONIBLE';
  const iniciales      = turno.medico?.nombre
    ? turno.medico.nombre.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('')
    : '?';

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/buscar-turnos')}
        sx={{ mb: 2, color: 'text.secondary', pl: 0 }}
      >
        Volver a resultados
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>

          {/* Encabezado */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 700, fontSize: '1.1rem' }}>
                {iniciales}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {turno.medico?.nombre || 'Profesional no asignado'}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={600} sx={{ mt: 0.25 }}>
                  {turno.servicio?.nombre || '—'}
                </Typography>
                {turno.servicio?.tipo && (
                  <Typography variant="caption" color="text.secondary">
                    {turno.servicio.tipo}
                    {turno.servicio.duracionMinutos ? ` · ${turno.servicio.duracionMinutos} min` : ''}
                  </Typography>
                )}
              </Box>
            </Box>
            <Chip
              label={estadoConfig.label}
              color={estadoConfig.color}
              variant="outlined"
              sx={{ fontWeight: 700, flexShrink: 0 }}
            />
          </Box>

          <Divider sx={{ mb: 2.5 }} />

          {/* Grilla de info */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mb: 2.5,
            }}
          >
            <InfoCard icon={<CalendarIcon />} label="Fecha">
              {formatearFecha(turno.fechaHora)}
            </InfoCard>

            <InfoCard icon={<ClockIcon />} label="Hora">
              {formatearHora(turno.fechaHora)} hs
            </InfoCard>

            <InfoCard icon={<LocationIcon />} label="Sede">
              {turno.sede?.nombre
                ? `${turno.sede.nombre}${turno.sede.direccion ? ` — ${turno.sede.direccion}` : ''}`
                : 'No especificada'
              }
            </InfoCard>

            <InfoCard icon={<CreditCardIcon />} label="Costo">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body1" fontWeight={700} color="primary">
                  ${(turno.costoPaciente ?? turno.costo ?? 0).toLocaleString('es-AR')}
                </Typography>
                {turno.cobertura && (
                  <Chip
                    label={
                      turno.cobertura === 'NO_CUBIERTA' || turno.cobertura === 'SIN_COBERTURA'
                        ? 'Sin Cobertura'
                        : turno.cobertura === 'PARCIAL'
                        ? 'Cobertura Parcial'
                        : turno.cobertura === 'TOTAL' || turno.cobertura === 'COMPLETA'
                        ? 'Cobertura Completa'
                        : turno.cobertura
                    }
                    size="small"
                    color={
                      turno.cobertura === 'NO_CUBIERTA' || turno.cobertura === 'SIN_COBERTURA'
                        ? 'error'
                        : turno.cobertura === 'PARCIAL'
                        ? 'warning'
                        : 'success'
                    }
                    sx={{ mt: 0.5, fontWeight: 700, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            </InfoCard>
          </Box>

          {/* Error de reserva */}
          {errorReserva && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorReserva(null)}>
              {errorReserva}
            </Alert>
          )}

          {/* Mensaje si ya está reservado */}
          {!estaDisponible && (
            <Alert severity={turno.estado === 'CANCELADO' ? 'error' : 'info'} sx={{ mb: 2 }}>
              {turno.estado === 'RESERVADO' || turno.estado === 'CONFIRMADO'
                ? 'Este turno ya está reservado.'
                : turno.estado === 'CANCELADO'
                ? 'Este turno fue cancelado.'
                : `Estado del turno: ${turno.estado}`
              }
            </Alert>
          )}

          <Divider sx={{ mb: 2.5 }} />

          {/* Botón de reserva */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/buscar-turnos')}
            >
              Volver
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={reservando ? <CircularProgress size={18} color="inherit" /> : <EventAvailableIcon />}
              onClick={handleReservar}
              disabled={!estaDisponible || reservando || !paciente}
            >
              {reservando ? 'Reservando...' : 'Reservar Turno'}
            </Button>
          </Box>

        </CardContent>
      </Card>

      {/* Snackbar de éxito */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
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