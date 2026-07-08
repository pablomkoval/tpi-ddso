import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Tabs, Tab, Stack, Snackbar, Alert,
} from '@mui/material';
import TurnoCard from './TurnoCard';
import ModalCancelarTurno from './ModalCancelarTurno';
import ModalCambioFecha from './ModalCambioFecha';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';
import {
    getMiPaciente,
    getMisTurnos,
    cancelarTurno,
    solicitarCambioFecha,
} from '../../services/pacienteService.js';

export default function MisTurnos() {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [paciente, setPaciente] = useState(null);
    const [turnos, setTurnos] = useState([]);
    const [errorGlobal, setErrorGlobal] = useState(null);

    // Estado de los modales
    const [modalCancelar, setModalCancelar] = useState({ open: false, turno: null });
    const [modalCambio, setModalCambio] = useState({ open: false, turno: null });
    const [accionLoading, setAccionLoading] = useState(false);
    const [accionError, setAccionError] = useState(null);

    // Snackbar feedback
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const mostrarMensaje = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const cargarDatos = useCallback(async () => {
        setLoading(true);
        setErrorGlobal(null);
        try {
            const pacienteData = await getMiPaciente();
            setPaciente(pacienteData);
            const turnosData = await getMisTurnos(pacienteData._id || pacienteData.id);
            setTurnos(turnosData);
        } catch (e) {
            const msg = e?.response?.data?.message || 'No se pudieron cargar los turnos. ¿Está logueado correctamente?';
            setErrorGlobal(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // Separar turnos próximos vs historial
    const ahora = new Date();
    const proximos = turnos.filter(
        (t) => ['RESERVADO', 'CONFIRMADO', 'PENDIENTE'].includes(t.estado) && new Date(t.fechaHora) >= ahora
    );
    const historial = turnos.filter(
        (t) => ['CANCELADO', 'REALIZADO', 'COMPLETADO'].includes(t.estado) || new Date(t.fechaHora) < ahora
    );

    const turnosMostrados = tab === 0 ? proximos : historial;

    // ── Cancelar ──────────────────────────────────────────────────────────
    const abrirModalCancelar = (turno) => {
        setAccionError(null);
        setModalCancelar({ open: true, turno });
    };

    const handleCancelar = async (motivo) => {
        if (!paciente || !modalCancelar.turno) return;
        setAccionLoading(true);
        setAccionError(null);
        try {
            const pacienteId = paciente._id || paciente.id;
            const turnoId = modalCancelar.turno._id || modalCancelar.turno.id;
            await cancelarTurno(pacienteId, turnoId, motivo);
            setModalCancelar({ open: false, turno: null });
            mostrarMensaje('Turno cancelado correctamente.');
            await cargarDatos();
        } catch (e) {
            const msg = e?.response?.data?.message || 'No se pudo cancelar el turno. Intente nuevamente.';
            setAccionError(msg);
        } finally {
            setAccionLoading(false);
        }
    };

    // ── Cambio de fecha ───────────────────────────────────────────────────
    const abrirModalCambio = (turno) => {
        setAccionError(null);
        setModalCambio({ open: true, turno });
    };

    const handleSolicitarCambio = async (nuevoTurnoId) => {
        if (!paciente || !modalCambio.turno) return;
        setAccionLoading(true);
        setAccionError(null);
        try {
            const pacienteId = paciente._id || paciente.id;
            const turnoActualId = modalCambio.turno._id || modalCambio.turno.id;
            await solicitarCambioFecha(pacienteId, turnoActualId, nuevoTurnoId);
            setModalCambio({ open: false, turno: null });
            mostrarMensaje('Solicitud de cambio enviada. El médico deberá confirmarla.');
            await cargarDatos();
        } catch (e) {
            const msg = e?.response?.data?.message || 'No se pudo solicitar el cambio. Intente nuevamente.';
            setAccionError(msg);
        } finally {
            setAccionLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 860, mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
                Mis Turnos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Administre sus citas médicas y visualice su historial.
            </Typography>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}
            >
                <Tab label={`Próximos${proximos.length > 0 ? ` (${proximos.length})` : ''}`} disabled={loading} />
                <Tab label="Historial" disabled={loading} />
            </Tabs>

            {loading ? (
                <Stack spacing={2}>
                    <CustomSkeleton type="list" count={3} />
                </Stack>
            ) : errorGlobal ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {errorGlobal}
                </Alert>
            ) : turnosMostrados.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    No hay turnos para mostrar.
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {turnosMostrados.map((turno) => (
                        <TurnoCard
                            key={turno._id || turno.id}
                            turno={turno}
                            onPedirCambio={() => abrirModalCambio(turno)}
                            onCancelar={() => abrirModalCancelar(turno)}
                        />
                    ))}
                </Stack>
            )}

            {/* Modal Cancelar */}
            <ModalCancelarTurno
                open={modalCancelar.open}
                turno={modalCancelar.turno}
                onClose={() => { setModalCancelar({ open: false, turno: null }); setAccionError(null); }}
                onConfirm={handleCancelar}
                loading={accionLoading}
                error={accionError}
            />

            {/* Modal Cambio de Fecha */}
            <ModalCambioFecha
                open={modalCambio.open}
                turno={modalCambio.turno}
                onClose={() => { setModalCambio({ open: false, turno: null }); setAccionError(null); }}
                onConfirm={handleSolicitarCambio}
                loading={accionLoading}
                error={accionError}
            />

            {/* Feedback global */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
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