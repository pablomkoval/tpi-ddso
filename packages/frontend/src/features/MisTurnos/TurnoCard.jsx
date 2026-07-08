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
    Tooltip,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    AccessTime as ClockIcon,
    LocationOn as LocationIcon,
    InfoOutlined as InfoIcon,
    WarningAmber as WarningIcon,
    Cancel as CancelIcon,
    SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { ZONA_HORARIA_ARGENTINA } from '../../utils/dateUtils';

const ESTADO_CONFIG = {
    DISPONIBLE:  { label: 'Disponible',  color: 'default' },
    RESERVADO:   { label: 'Reservado',   color: 'success' },
    CONFIRMADO:  { label: 'Confirmado',  color: 'primary' },
    PENDIENTE:   { label: 'Pendiente',   color: 'warning' },
    COMPLETADO:  { label: 'Completado',  color: 'default' },
    REALIZADO:   { label: 'Realizado',   color: 'default' },
    CANCELADO:   { label: 'Cancelado',   color: 'error' },
};

function formatFecha(fechaHora) {
  const date = new Date(fechaHora);
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: ZONA_HORARIA_ARGENTINA,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatHora(fechaHora) {
  const date = new Date(fechaHora);
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: ZONA_HORARIA_ARGENTINA,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Determina si el turno puede ser cancelado o se puede pedir cambio.
 * Solo turnos RESERVADO o CONFIRMADO son elegibles.
 * Además el turno debe ser futuro.
 */
function puedeAccionar(turno) {
    const estadosValidos = ['RESERVADO', 'CONFIRMADO'];
    const esFuturo = new Date(turno.fechaHora) > new Date();
    return estadosValidos.includes(turno.estado) && esFuturo;
}

function AccionesRow({ turno, onPedirCambio, onCancelar }) {
    if (!puedeAccionar(turno)) return null;

    return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Solicitar un cambio de fecha al mismo médico y especialidad">
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SwapIcon />}
                    onClick={onPedirCambio}
                >
                    Cambiar Fecha
                </Button>
            </Tooltip>
            <Tooltip title="Cancelar el turno (mín. 1 hora de anticipación requerida)">
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={onCancelar}
                >
                    Cancelar
                </Button>
            </Tooltip>
        </Box>
    );
}

/**
 * Extrae el nombre del médico de la estructura poblada del backend.
 */
function getNombreMedico(turno) {
    return turno?.medico?.nombre || '—';
}

/**
 * Extrae las iniciales del médico.
 */
function getInicialesMedico(turno) {
    const nombre = getNombreMedico(turno);
    if (nombre === '—') return '?';
    return nombre
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('');
}

/**
 * Extrae el nombre de la especialidad/práctica del turno.
 */
function getNombreServicio(turno) {
    return turno?.servicio?.servicioUnico?.nombre
        || turno?.servicio?.nombre
        || '—';
}

/**
 * Extrae el nombre de la sede.
 */
function getNombreSede(turno) {
    return turno?.sede?.nombre || turno?.sede || '—';
}

export default function TurnoCard({ turno, onPedirCambio, onCancelar }) {
    const estadoConfig = ESTADO_CONFIG[turno.estado] ?? { label: turno.estado, color: 'default' };
    const tieneAcciones = puedeAccionar(turno);

    const esPendiente = turno.estado === 'PENDIENTE';
    const nota = esPendiente
        ? 'Su solicitud de cambio está pendiente de confirmación por el médico.'
        : null;

    return (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{
                        width: 52, height: 52,
                        bgcolor: 'primary.main',
                        fontWeight: 700, fontSize: '1rem',
                        flexShrink: 0,
                    }}>
                        {getInicialesMedico(turno)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                                {getNombreMedico(turno)}
                            </Typography>
                            <Chip
                                label={estadoConfig.label}
                                color={estadoConfig.color}
                                size="small"
                                sx={{ fontWeight: 700, fontSize: '0.7rem', flexShrink: 0 }}
                            />
                        </Box>

                        <Typography variant="body2" color="primary" fontWeight={600} sx={{ mb: 1.5 }}>
                            {getNombreServicio(turno)}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 3 }, flexWrap: 'wrap' }}>
                            <InfoChip icon={<CalendarIcon sx={{ fontSize: 16 }} />} text={formatFecha(turno.fechaHora)} />
                            <InfoChip icon={<ClockIcon sx={{ fontSize: 16 }} />} text={`${formatHora(turno.fechaHora)} hs`} />
                            <InfoChip icon={<LocationIcon sx={{ fontSize: 16 }} />} text={getNombreSede(turno)} />
                        </Box>
                    </Box>
                </Box>

                {(tieneAcciones || nota) && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            {nota && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {nota}
                                    </Typography>
                                </Box>
                            )}
                            <Box sx={{ ml: 'auto' }}>
                                <AccionesRow
                                    turno={turno}
                                    onPedirCambio={onPedirCambio}
                                    onCancelar={onCancelar}
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