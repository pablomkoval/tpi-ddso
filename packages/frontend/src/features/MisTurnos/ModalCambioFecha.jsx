import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    Stack,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { buscarTurnosParaCambio } from '../../services/pacienteService.js';

function formatFecha(fechaHora) {
    return new Intl.DateTimeFormat('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(fechaHora));
}

function formatHora(fechaHora) {
    return new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(fechaHora));
}

/**
 * Modal para solicitar un cambio de fecha de turno.
 * Filtra automáticamente los turnos disponibles del mismo médico y misma especialidad/práctica.
 * El backend también valida esta restricción.
 *
 * @param {boolean} open
 * @param {Object} turno - Turno actual a cambiar
 * @param {Function} onClose
 * @param {Function} onConfirm - Recibe el ID del nuevo turno seleccionado
 * @param {boolean} loading - Procesando la solicitud
 * @param {string|null} error - Error del backend
 */
export default function ModalCambioFecha({ open, turno, onClose, onConfirm, loading, error }) {
    const [turnosDisponibles, setTurnosDisponibles] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [errorCarga, setErrorCarga] = useState(null);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);

    // Obtener el ID del servicio base (servicioUnico) y del médico
    const medicoId = turno?.medico?._id || turno?.medico;
    const servicioId = turno?.servicio?.servicioUnico?._id || turno?.servicio?.servicioUnico;
    const nombreServicio = turno?.servicio?.servicioUnico?.nombre || turno?.servicio?.nombre || '—';
    const nombreMedico = turno?.medico?.nombre || '—';

    useEffect(() => {
        if (!open || !medicoId || !servicioId) return;

        const cargar = async () => {
            setCargando(true);
            setErrorCarga(null);
            setTurnoSeleccionado(null);
            try {
                const resultados = await buscarTurnosParaCambio(medicoId, servicioId);
                setTurnosDisponibles(resultados);
            } catch (e) {
                setErrorCarga('No se pudieron cargar los turnos disponibles. Intente nuevamente.');
                setTurnosDisponibles([]);
            } finally {
                setCargando(false);
            }
        };

        cargar();
    }, [open, medicoId, servicioId]);

    const handleClose = () => {
        setTurnoSeleccionado(null);
        onClose();
    };

    const handleConfirm = () => {
        if (!turnoSeleccionado) return;
        onConfirm(turnoSeleccionado.id || turnoSeleccionado._id);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonthIcon color="primary" />
                Solicitar Cambio de Fecha
            </DialogTitle>

            <DialogContent>
                {/* Info del turno actual */}
                <Box
                    sx={{
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Turno Actual
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                        <strong>{nombreMedico}</strong> — {nombreServicio}
                    </Typography>
                    {turno?.fechaHora && (
                        <Typography variant="body2" color="text.secondary">
                            {formatFecha(turno.fechaHora)} a las {formatHora(turno.fechaHora)}
                        </Typography>
                    )}
                </Box>

                <Alert severity="info" sx={{ mb: 2 }}>
                    Solo se muestran turnos del <strong>mismo médico ({nombreMedico})</strong> y la misma especialidad/práctica. El médico deberá confirmar el cambio.
                </Alert>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                    Turnos Disponibles
                </Typography>

                {cargando ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : errorCarga ? (
                    <Alert severity="error">{errorCarga}</Alert>
                ) : turnosDisponibles.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">
                            No hay otros turnos disponibles para este médico y especialidad.
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={1.5}>
                        {turnosDisponibles.map((t) => {
                            const tid = t.id || t._id;
                            const seleccionado = turnoSeleccionado?.id === tid || turnoSeleccionado?._id === tid;
                            return (
                                <Box
                                    key={tid}
                                    onClick={() => setTurnoSeleccionado(t)}
                                    sx={{
                                        border: '2px solid',
                                        borderColor: seleccionado ? 'primary.main' : 'divider',
                                        borderRadius: 2,
                                        p: 2,
                                        cursor: 'pointer',
                                        bgcolor: seleccionado ? 'primary.light' : 'background.paper',
                                        transition: 'all 0.15s ease',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: 'primary.light',
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                                                <CalendarMonthIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                                                <Typography variant="body2" fontWeight={600}>
                                                    {formatFecha(t.fechaHora)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatHora(t.fechaHora)} hs
                                                </Typography>
                                            </Box>
                                            {t.sede && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                    <LocationOnIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {t.sede?.nombre || t.sede}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        {seleccionado && (
                                            <CheckCircleIcon color="primary" />
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={loading} color="inherit">
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={loading || !turnoSeleccionado}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    Solicitar Cambio
                </Button>
            </DialogActions>
        </Dialog>
    );
}
