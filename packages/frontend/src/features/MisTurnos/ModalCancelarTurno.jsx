import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * Modal para cancelar un turno. Requiere un motivo obligatorio.
 * Solo muestra la opción de cancelar turnos con estado RESERVADO o CONFIRMADO.
 *
 * @param {boolean} open
 * @param {Object} turno - Datos del turno a cancelar
 * @param {Function} onClose - Cerrar el modal sin cancelar
 * @param {Function} onConfirm - Confirmar cancelación, recibe el motivo
 * @param {boolean} loading - Indicador de carga mientras se procesa
 * @param {string|null} error - Mensaje de error del backend si falla
 */
export default function ModalCancelarTurno({ open, turno, onClose, onConfirm, loading, error }) {
    const [motivo, setMotivo] = useState('');

    const handleConfirm = () => {
        if (!motivo.trim()) return;
        onConfirm(motivo.trim());
    };

    const handleClose = () => {
        setMotivo('');
        onClose();
    };

    const fechaFormateada = turno?.fechaHora
        ? new Intl.DateTimeFormat('es-AR', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }).format(new Date(turno.fechaHora))
        : '';

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon color="error" />
                Cancelar Turno
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Médico: <strong>{turno?.medico?.nombre || turno?.medico || '—'}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Servicio: <strong>{turno?.servicio?.servicioUnico?.nombre || turno?.servicio?.nombre || '—'}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Fecha: <strong>{fechaFormateada}</strong>
                    </Typography>
                </Box>

                <Alert severity="warning" sx={{ mb: 2 }}>
                    La cancelación solo está permitida con al menos <strong>1 hora de anticipación</strong>.
                </Alert>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Motivo de cancelación"
                    multiline
                    rows={3}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    required
                    fullWidth
                    placeholder="Ej: Tengo otra obligación en ese horario..."
                    helperText="Requerido. El médico recibirá una notificación con este motivo."
                    disabled={loading}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button onClick={handleClose} disabled={loading} color="inherit">
                    Volver
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={loading || !motivo.trim()}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    Confirmar Cancelación
                </Button>
            </DialogActions>
        </Dialog>
    );
}
