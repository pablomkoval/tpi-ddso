import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  LocationOn as LocationIcon,
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';

const ESTADO_CONFIG = {
  RESERVADO: { label: 'RESERVADO', color: 'success' },
  PENDIENTE: { label: 'PENDIENTE', color: 'warning' },
  COMPLETADO: { label: 'COMPLETADO', color: 'default' },
  CANCELADO: { label: 'CANCELADO', color: 'error' },
};

function formatFecha(fechaHora) {
  const date = new Date(fechaHora);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatHora(fechaHora) {
  const date = new Date(fechaHora);
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function AccionesRow({ estado, onPedirCambio, onCancelar, onDeshacerSolicitud }) {
  if (estado === 'RESERVADO') {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" onClick={onPedirCambio}>
          Pedir Cambio
        </Button>
        <Button variant="outlined" color="error" size="small" onClick={onCancelar}>
          Cancelar
        </Button>
      </Box>
    );
  }
  if (estado === 'PENDIENTE') {
    return (
      <Button variant="outlined" size="small" onClick={onDeshacerSolicitud}>
        Deshacer Solicitud
      </Button>
    );
  }
  return null;
}

export default function TurnoCard({ turno, onPedirCambio, onCancelar, onDeshacerSolicitud }) {
  const { medico, iniciales, especialidad, fechaHora, lugar, estado, nota } = turno;
  const estadoConfig = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.PENDIENTE;
  const tieneAcciones = estado === 'RESERVADO' || estado === 'PENDIENTE';

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: 'primary.main', fontWeight: 700, fontSize: '1rem' }}>
            {iniciales}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                {medico}
              </Typography>
              <Chip
                label={estadoConfig.label}
                color={estadoConfig.color}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}
              />
            </Box>

            <Typography variant="body2" color="primary" fontWeight={600} sx={{ mb: 1.5 }}>
              {especialidad}
            </Typography>

            <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 3 }, flexWrap: 'wrap' }}>
              <InfoChip icon={<CalendarIcon sx={{ fontSize: 16 }} />} text={formatFecha(fechaHora)} />
              <InfoChip icon={<ClockIcon sx={{ fontSize: 16 }} />} text={formatHora(fechaHora)} />
              <InfoChip icon={<LocationIcon sx={{ fontSize: 16 }} />} text={lugar} />
            </Box>
          </Box>
        </Box>

        {tieneAcciones && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              {nota && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {estado === 'PENDIENTE'
                    ? <WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                    : <InfoIcon sx={{ fontSize: 18, color: 'info.main' }} />
                  }
                  <Typography variant="caption" color="text.secondary">
                    {nota}
                  </Typography>
                </Box>
              )}
              <Box sx={{ ml: 'auto' }}>
                <AccionesRow
                  estado={estado}
                  onPedirCambio={onPedirCambio}
                  onCancelar={onCancelar}
                  onDeshacerSolicitud={onDeshacerSolicitud}
                />
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InfoChip({ icon, text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
      {icon}
      <Typography variant="caption">{text}</Typography>
    </Box>
  );
}