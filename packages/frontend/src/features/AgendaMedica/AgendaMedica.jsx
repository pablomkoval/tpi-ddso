import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography, Card, CardContent, Avatar, Box, Stack, Button, Dialog,
    DialogContent, DialogActions, Divider, IconButton, Snackbar, Alert,
    Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, TextField
} from '@mui/material';

import BotonHistorialPaciente from '../../components/BotonHistorialPaciente.jsx';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';
import {
    getMiMedico, getAgenda, confirmarTurno, getHistorialTurnos,
    realizarTurno, cancelarTurno, proponerCambioTurno
} from '../../services/medicoService.js';
import { ZONA_HORARIA_ARGENTINA, obtenerPartesEnZonaArgentina, esMismoDiaEnArgentina } from '../../utils/dateUtils.js';

const horasAgenda = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const HORA_INICIO = 8;

const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
};

const formatearSemana = (inicio) => {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(inicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);
    const mesInicio = fechaInicio.toLocaleDateString("es-AR", { month: "long" });
    const mesFin = fechaFin.toLocaleDateString("es-AR", { month: "long" });
    const anio = fechaInicio.getFullYear();
    if (mesInicio === mesFin) {
        return `Semana del ${fechaInicio.getDate()} al ${fechaFin.getDate()} de ${mesInicio}, ${anio}`;
    }
    return `${fechaInicio.getDate()} de ${mesInicio} – ${fechaFin.getDate()} de ${mesFin}, ${anio}`;
};

const AgendaMedica = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [medico, setMedico] = useState(null);
    const [currentMonday, setCurrentMonday] = useState(getMonday(new Date()));
    const [turnos, setTurnos] = useState([]);
    const [selectedTurno, setSelectedTurno] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Cancelación
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');

    // Propuesta de cambio
    const [showChangeForm, setShowChangeForm] = useState(false);
    const [selectedNuevoTurnoId, setSelectedNuevoTurnoId] = useState('');
    const [motivoCambio, setMotivoCambio] = useState('');

    // Histórico
    const [historial, setHistorial] = useState([]);
    const [historialPage, setHistorialPage] = useState(0);
    const [historialTotal, setHistorialTotal] = useState(0);
    const [historialLoading, setHistorialLoading] = useState(false);
    const HISTORIAL_ROWS = 5;

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, mensaje: '', tipo: 'success' });

    // Cargar perfil del médico
    useEffect(() => {
        const fetchMedico = async () => {
            try {
                const data = await getMiMedico();
                setMedico(data);
            } catch (err) {
                console.error("Error al obtener perfil del médico:", err);
                setSnackbar({ open: true, mensaje: "No se pudieron cargar tus datos de médico", tipo: "error" });
            }
        };
        fetchMedico();
    }, []);

    // Cargar turnos de la agenda
    const loadAgendaData = useCallback(async () => {
        if (!medico) return;
        try {
            setLoading(true);
            const fechaHasta = new Date(currentMonday);
            fechaHasta.setDate(currentMonday.getDate() + 6);
            fechaHasta.setHours(23, 59, 59, 999);

            const agendaData = await getAgenda(medico.id || medico._id, currentMonday.toISOString(), fechaHasta.toISOString());

            const mappedTurnos = agendaData
                .filter(turno => turno.estado.toLowerCase() !== 'cancelado')
                .map(turno => {
                    const fecha = new Date(turno.fechaHora);
                    const { diaSemana, hora: horas, minuto: minutos } = obtenerPartesEnZonaArgentina(fecha);
                    const columna = diaSemana === 0 ? 7 : diaSemana;
                    const top = (horas - HORA_INICIO) * 60 + minutos;
                    const duracion = turno.servicio?.duracionMinutos ?? turno.servicio?.duracionTurnoEnMins ?? 30;
                    const height = Math.max(duracion, 40);
                    const pacienteNombre = turno.pacienteDetalle?.nombre || (turno.paciente ? "Paciente Registrado" : "Disponible");

                    return {
                        id: turno.id || turno._id,
                        paciente: pacienteNombre,
                        pacienteDni: turno.pacienteDetalle?.dni,
                        pacienteIdReal: turno.paciente?._id || turno.paciente?.id || turno.paciente,
                        motivo: turno.servicio?.nombre || turno.servicio?.servicioUnico?.nombre || "Consulta General",
                        estado: turno.estado.toLowerCase(),
                        columna,
                        top,
                        height,
                        fechaHora: fecha,
                        sede: turno.sede?.nombre || "Sede Principal",
                        cobertura: turno.cobertura,
                        costoPaciente: turno.costoPaciente,
                        original: turno
                    };
                });

            setTurnos(mappedTurnos);
        } catch (err) {
            console.error("Error al cargar la agenda médica:", err);
            setSnackbar({ open: true, mensaje: "No se pudo cargar la agenda médica", tipo: "error" });
        } finally {
            setLoading(false);
        }
    }, [medico, currentMonday]);

    useEffect(() => {
        loadAgendaData();
    }, [loadAgendaData]);

    // Cargar histórico de turnos realizados
    const loadHistorial = useCallback(async () => {
        if (!medico) return;
        try {
            setHistorialLoading(true);
            const data = await getHistorialTurnos(medico.id || medico._id, historialPage + 1, HISTORIAL_ROWS);
            setHistorial(data.turnos || []);
            setHistorialTotal(data.pagination?.total || 0);
        } catch (err) {
            console.error("Error al cargar historial:", err);
        } finally {
            setHistorialLoading(false);
        }
    }, [medico, historialPage]);

    useEffect(() => {
        loadHistorial();
    }, [loadHistorial]);

    // Navegación
    const handleSemanaAnterior = () => {
        setCurrentMonday(prev => {
            const d = new Date(prev);
            d.setDate(prev.getDate() - 7);
            return d;
        });
    };

    const handleSemanaSiguiente = () => {
        setCurrentMonday(prev => {
            const d = new Date(prev);
            d.setDate(prev.getDate() + 7);
            return d;
        });
    };

    const handleHoy = () => {
        setCurrentMonday(getMonday(new Date()));
    };

    const esEstaSemana = () => {
        return currentMonday.getTime() === getMonday(new Date()).getTime();
    };

    const cerrarDialog = () => {
        setOpenDialog(false);
        setSelectedTurno(null);
        setShowCancelForm(false);
        setMotivoCancelacion('');
        setShowChangeForm(false);
        setSelectedNuevoTurnoId('');
        setMotivoCambio('');
    };

    const obtenerEstilosEstado = (estado) => {
        switch (estado) {
            case 'realizado':
            case 'completado':
                return { bg: '#e8f5e9', border: '#43a047', texto: '#2e7d32', label: 'Realizado' };
            case 'reservado':
                return { bg: '#fff8e1', border: '#ffa726', texto: '#e65100', label: 'Pendiente' };
            case 'confirmado':
                return { bg: '#e3f2fd', border: '#1e88e5', texto: '#1565c0', label: 'Confirmado' };
            case 'disponible':
                return { bg: '#f3e5f5', border: '#ab47bc', texto: '#7b1fa2', label: 'Disponible' };
            default:
                return { bg: '#f5f5f5', border: '#9e9e9e', texto: '#616161', label: estado };
        }
    };

    const handleConfirmar = async () => {
        if (!medico || !selectedTurno) return;
        try {
            setActionLoading(true);
            await confirmarTurno(selectedTurno.id);
            setSnackbar({ open: true, mensaje: "Turno confirmado con éxito", tipo: "success" });
            cerrarDialog();
            await loadAgendaData();
        } catch (err) {
            const errMsg = err.response?.data?.message || "No se pudo confirmar el turno";
            setSnackbar({ open: true, mensaje: errMsg, tipo: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleRealizar = async () => {
        if (!medico || !selectedTurno) return;
        try {
            setActionLoading(true);
            await realizarTurno(selectedTurno.id);
            setSnackbar({ open: true, mensaje: "Turno marcado como realizado", tipo: "success" });
            cerrarDialog();
            await loadAgendaData();
            await loadHistorial();
        } catch (err) {
            const errMsg = err.response?.data?.message || "No se pudo marcar el turno como realizado";
            setSnackbar({ open: true, mensaje: errMsg, tipo: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelar = async () => {
        if (!medico || !selectedTurno || !motivoCancelacion.trim()) return;
        try {
            setActionLoading(true);
            await cancelarTurno(selectedTurno.id, motivoCancelacion.trim());
            setSnackbar({ open: true, mensaje: "Turno cancelado correctamente", tipo: "success" });
            cerrarDialog();
            await loadAgendaData();
        } catch (err) {
            const errMsg = err.response?.data?.message || "No se pudo cancelar el turno";
            setSnackbar({ open: true, mensaje: errMsg, tipo: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleProponerCambio = async () => {
        if (!medico || !selectedTurno || !selectedNuevoTurnoId) return;
        try {
            setActionLoading(true);
            await proponerCambioTurno(
                selectedTurno.id,
                selectedNuevoTurnoId,
                medico.id || medico._id,
                motivoCambio.trim()
            );
            setSnackbar({ open: true, mensaje: "Propuesta de cambio enviada al paciente", tipo: "success" });
            cerrarDialog();
            await loadAgendaData();
        } catch (err) {
            const errMsg = err.response?.data?.message || "No se pudo proponer el cambio";
            setSnackbar({ open: true, mensaje: errMsg, tipo: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    // Estadísticas
    const turnosHoy = turnos.filter(t => {
        return esMismoDiaEnArgentina(t.fechaHora, new Date()) && (t.estado === 'confirmado' || t.estado === 'reservado');
    }).length;
    const confirmados = turnos.filter(t => t.estado === 'confirmado').length;
    const pendientesConfirmacion = turnos.filter(t => t.estado === 'reservado').length;

    // Días de la semana
    const diasCabecera = [];
    const hoy = new Date();
    const partesHoy = obtenerPartesEnZonaArgentina(hoy);
    for (let i = 0; i < 7; i++) {
        const d = new Date(currentMonday);
        d.setDate(currentMonday.getDate() + i);
        diasCabecera.push({
            label: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'][i],
            numero: d.getDate(),
            esHoy: esMismoDiaEnArgentina(d, hoy),
            columna: i + 1
        });
    }

    const timeIndicatorTop = (partesHoy.hora - HORA_INICIO) * 60 + partesHoy.minuto;
    const showTimeIndicator = esEstaSemana() && partesHoy.hora >= HORA_INICIO && partesHoy.hora <= 18;
    const todayCol = partesHoy.diaSemana === 0 ? 7 : partesHoy.diaSemana;

    const puedesCancelar = selectedTurno && (selectedTurno.estado === 'reservado' || selectedTurno.estado === 'confirmado');

    return (
        <Box sx={{ display: 'flex', gap: 4, p: { xs: 2, md: 3 }, minHeight: '85vh', bgcolor: '#f9f9ff' }}>
            <Box component="main" sx={{ flexGrow: 1, maxWidth: 1200, width: '100%', mx: 'auto' }}>

                {/* ─── ENCABEZADO ─── */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Agenda Médica
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatearSemana(currentMonday)}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton onClick={handleSemanaAnterior} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <Button variant={esEstaSemana() ? "contained" : "outlined"} size="small" onClick={handleHoy} startIcon={<TodayIcon />} sx={{ borderRadius: 2, px: 2 }}>
                            Hoy
                        </Button>
                        <IconButton onClick={handleSemanaSiguiente} size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Stack>
                </Box>

                {/* ─── TARJETAS DE ESTADÍSTICAS ─── */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3.5 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1565c0', width: 44, height: 44 }}>
                                <TodayIcon />
                            </Avatar>
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{turnosHoy}</Typography>
                                <Typography variant="body2" color="text.secondary">Turnos de Hoy</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                            <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 44, height: 44 }}>
                                <EventAvailableIcon />
                            </Avatar> <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{confirmados}</Typography>
                                <Typography variant="body2" color="text.secondary">Confirmados</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                            <Avatar sx={{ bgcolor: '#fff3e0', color: '#e65100', width: 44, height: 44 }}>
                                <PendingActionsIcon />
                            </Avatar>
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{pendientesConfirmacion}</Typography>
                                <Typography variant="body2" color="text.secondary">Por Confirmar</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* ─── CALENDARIO SEMANAL ─── */}
                <Box sx={{ bgcolor: '#ffffff', border: '1px solid', borderColor: '#dfe1ea', borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0, 71, 141, 0.04)' }}>

                    {/* Header de días (Cambiado a repeat(7, 1fr)) */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '2px solid', borderColor: '#e2e4ef', background: 'linear-gradient(180deg, #f6f7fc 0%, #f0f1f8 100%)' }}>
                        <Box sx={{ borderRight: '1px solid #e8e9f2' }} />
                        {diasCabecera.map((dia, idx) => (
                            <Box key={idx} sx={{ p: '12px 8px 10px', textStyle: 'center', bgcolor: dia.esHoy ? 'rgba(0, 94, 184, 0.06)' : 'transparent', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: dia.esHoy ? 'primary.main' : 'text.secondary', fontWeight: 'bold', fontSize: '0.7rem' }}>
                                    {dia.label}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: dia.esHoy ? 'primary.main' : 'text.primary', fontSize: '1.1rem' }}>
                                    {dia.numero}
                                </Typography>
                                {dia.esHoy && (
                                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', mx: 'auto', mt: 0.3 }} />
                                )}
                            </Box>
                        ))}
                    </Box>

                    {loading && turnos.length === 0 ? (
                        <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                            <CustomSkeleton type="table" count={5} />
                        </Box>
                    ) : (
                        <Box sx={{ overflowY: 'auto', maxHeight: { xs: 400, md: 520 } }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', position: 'relative', height: `${horasAgenda.length * 60}px` }}>
                                {horasAgenda.map((hora, indice) => (
                                    <React.Fragment key={hora}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', pt: '4px', pr: '12px', color: '#8b8fa3', fontSize: 12, fontWeight: 600, letterSpacing: '0.3px', borderRight: '1px solid #e8e9f2', borderBottom: '1px solid #f2f3fb', gridRowStart: indice + 1 }}>
                                            {hora}
                                        </Box>
                                        {[1, 2, 3, 4, 5, 6, 7].map(col => (
                                            <Box key={col} sx={{ height: 60, borderBottom: '1px solid #f2f3fb', borderRight: '1px solid #f2f3fb', bgcolor: diasCabecera[col - 1]?.esHoy ? 'rgba(0, 94, 184, 0.018)' : 'transparent', gridRowStart: indice + 1 }} />
                                        ))}
                                    </React.Fragment>
                                ))}

                                {showTimeIndicator && (
                                    <Box sx={{ position: 'absolute', zIndex: 4, display: 'flex', alignItems: 'center', pointerEvents: 'none', top: `${timeIndicatorTop}px`, left: `calc(80px + ((100% - 80px) / 7) * ${todayCol - 1})`, width: `calc((100% - 80px) / 7)` }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)', flexShrink: 0, ml: '-5px' }} />
                                        <Box sx={{ height: '2px', width: '100%', bgcolor: '#ef4444', opacity: 0.7 }} />
                                    </Box>
                                )}

                                {turnos.filter(t => t.columna >= 1 && t.columna <= 7).map((turno) => {
                                    const config = obtenerEstilosEstado(turno.estado);
                                    return (
                                        <Box key={turno.id} onClick={() => { setSelectedTurno(turno); setOpenDialog(true); }}
                                            sx={{
                                                position: 'absolute',
                                                left: `calc(80px + ((100% - 80px) / 7) * ${turno.columna - 1} + 3px)`,
                                                width: `calc((100% - 80px) / 7 - 6px)`,
                                                top: `${turno.top}px`,
                                                height: `${turno.height}px`,
                                                bgcolor: config.bg,
                                                borderLeft: `4px solid ${config.border}`,
                                                borderRadius: '0 8px 8px 0',
                                                p: '6px 8px',
                                                cursor: 'pointer',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                                                transition: 'box-shadow 0.2s, transform 0.2s',
                                                textAlign: 'left',
                                                zIndex: 2,
                                                overflow: 'hidden',
                                                '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 3px 8px rgba(0,0,0,0.1)', zIndex: 3 }
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '9px', fontWeight: 'bold', color: config.texto, textTransform: 'uppercase', mb: 0.25 }}>
                                                {config.label}
                                            </Typography>
                                            <Typography variant="body2" noWrap sx={{ fontWeight: 'bold', fontSize: '12px', color: 'text.primary' }}>
                                                {turno.paciente}
                                            </Typography>
                                            {turno.height >= 50 && (
                                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '10px' }}>
                                                    {turno.motivo}
                                                </Typography>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* ─── HISTÓRICO DE TURNOS REALIZADOS ─── */}
                <Box sx={{ mt: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <HistoryIcon sx={{ color: 'text.secondary' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                            Histórico de Turnos Realizados
                        </Typography>
                    </Stack>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8f9fc' }}>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>Fecha</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>Paciente</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>DNI</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>Servicio</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: '0.75rem' }}>Sede</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {historialLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <CircularProgress size={24} />
                                            </TableCell>
                                        </TableRow>
                                    ) : historial.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <Stack alignItems="center" spacing={1}>
                                                    <AssignmentTurnedInIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Aún no hay turnos realizados
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        historial.map((turno, idx) => {
                                            const fecha = new Date(turno.fechaHora);
                                            return (
                                                <TableRow key={turno._id || turno.id || idx} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                                                            {fecha.toLocaleDateString("es-AR", { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: ZONA_HORARIA_ARGENTINA })}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {fecha.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit', timeZone: ZONA_HORARIA_ARGENTINA })} hs
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {turno.pacienteDetalle?.nombre || 'Paciente'}
                                                            </Typography>
                                                            {(turno.paciente?._id || turno.paciente?.id || turno.paciente) && (
                                                                <BotonHistorialPaciente pacienteId={turno.paciente?._id || turno.paciente?.id || turno.paciente} />
                                                            )}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {turno.pacienteDetalle?.dni || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {turno.servicio?.nombre || turno.servicio?.servicioUnico?.nombre || 'Consulta'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {turno.sede?.nombre || '—'}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {historialTotal > 0 && (
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Button size="small" disabled={historialPage === 0} onClick={() => setHistorialPage(p => p - 1)}>
                                    Anterior
                                </Button>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Página {historialPage + 1} de {Math.ceil(historialTotal / HISTORIAL_ROWS)}
                                </Typography>
                                <Button size="small" disabled={(historialPage + 1) * HISTORIAL_ROWS >= historialTotal} onClick={() => setHistorialPage(p => p + 1)}>
                                    Siguiente
                                </Button>
                            </Box>
                        )}
                    </Card>
                </Box>

                {/* ─── DIALOG DETALLE DEL TURNO ─── */}
                <Dialog open={openDialog} onClose={cerrarDialog} PaperProps={{ sx: { borderRadius: 3, minWidth: 370, maxWidth: 430 } }}>
                    {selectedTurno && (
                        <>
                            <Box sx={{ p: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        Detalle del Turno
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, mt: 0.3, textAlign: 'left' }}>
                                        {selectedTurno.paciente}
                                    </Typography>
                                    {selectedTurno.pacienteDni && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3, textAlign: 'left' }}>
                                            DNI: {selectedTurno.pacienteDni}
                                        </Typography>
                                    )}
                                </Box>
                                <IconButton onClick={cerrarDialog} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Divider />
                            <DialogContent sx={{ p: 2.5 }}>
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip label={obtenerEstilosEstado(selectedTurno.estado).label} size="small" sx={{ bgcolor: obtenerEstilosEstado(selectedTurno.estado).bg, color: obtenerEstilosEstado(selectedTurno.estado).texto, fontWeight: 'bold', border: `1px solid ${obtenerEstilosEstado(selectedTurno.estado).border}` }} />

                                    {/* Vinculación con tu feature de historial médico */}
                                    {selectedTurno.pacienteIdReal && selectedTurno.estado !== 'disponible' && (
                                        <BotonHistorialPaciente pacienteId={selectedTurno.pacienteIdReal} />
                                    )}
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <AccessTimeIcon color="action" sx={{ fontSize: 18 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">Hora</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {selectedTurno.fechaHora.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit', timeZone: ZONA_HORARIA_ARGENTINA })} hs
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarTodayIcon color="action" sx={{ fontSize: 18 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">Fecha</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {selectedTurno.fechaHora.toLocaleDateString("es-AR", { day: '2-digit', month: 'short', year: 'numeric', timeZone: ZONA_HORARIA_ARGENTINA })}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PlaceIcon color="action" sx={{ fontSize: 18 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">Sede</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTurno.sede}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <LocalHospitalIcon color="action" sx={{ fontSize: 18 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">Servicio</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedTurno.motivo}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                {selectedTurno.costoPaciente !== undefined && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Costo Paciente</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>${selectedTurno.costoPaciente}</Typography>
                                        </Box>
                                    </>
                                )}

                                {showCancelForm && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: '#fff5f5', borderRadius: 2, border: '1px solid #ffcdd2' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#c62828', textAlign: 'left' }}>
                                            Motivo de cancelación *
                                        </Typography>
                                        <TextField fullWidth multiline rows={2} size="small" placeholder="Ej: Urgencia en quirófano, reprogramación..." value={motivoCancelacion} onChange={(e) => setMotivoCancelacion(e.target.value)} sx={{ bgcolor: 'white' }} />
                                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                            <Button size="small" variant="outlined" onClick={() => { setShowCancelForm(false); setMotivoCancelacion(''); }} sx={{ borderRadius: 2 }}>
                                                Volver
                                            </Button>
                                            <Button size="small" variant="contained" color="error" disabled={actionLoading || !motivoCancelacion.trim()} onClick={handleCancelar} startIcon={actionLoading ? <CircularProgress size={14} color="inherit" /> : null} sx={{ borderRadius: 2 }}>
                                                Confirmar Cancelación
                                            </Button>
                                        </Stack>
                                    </Box>
                                )}

                                {showChangeForm && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f4f8', borderRadius: 2, border: '1px solid #d0d7de' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main', textAlign: 'left' }}>
                                            Seleccionar nueva fecha y hora *
                                        </Typography>
                                        <TextField select fullWidth size="small" value={selectedNuevoTurnoId} onChange={(e) => setSelectedNuevoTurnoId(e.target.value)} SelectProps={{ native: true }} sx={{ bgcolor: 'white', mb: 2 }} >
                                            <option value="">-- Seleccionar horario disponible --</option>
                                            {turnos.filter(t => t.estado === 'disponible').map(t => {
                                                const fecha = new Date(t.fechaHora);
                                                const label = `${fecha.toLocaleDateString("es-AR", { timeZone: ZONA_HORARIA_ARGENTINA })} a las ${fecha.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit', timeZone: ZONA_HORARIA_ARGENTINA })} hs - Sede: ${t.sede}`;
                                                return (
                                                    <option key={t.id} value={t.id}>{label}</option>
                                                );
                                            })}
                                        </TextField>
                                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, textAlign: 'left' }}>
                                            Motivo del cambio
                                        </Typography>
                                        <TextField fullWidth multiline rows={2} size="small" placeholder="Ej: Reprogramación por congreso..." value={motivoCambio} onChange={(e) => setMotivoCambio(e.target.value)} sx={{ bgcolor: 'white' }} />
                                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                            <Button size="small" variant="outlined" onClick={() => { setShowChangeForm(false); setSelectedNuevoTurnoId(''); setMotivoCambio(''); }} sx={{ borderRadius: 2 }}>
                                                Volver
                                            </Button>
                                            <Button size="small" variant="contained" color="primary" disabled={actionLoading || !selectedNuevoTurnoId} onClick={handleProponerCambio} startIcon={actionLoading ? <CircularProgress size={14} color="inherit" /> : null} sx={{ borderRadius: 2 }}>
                                                Enviar Propuesta
                                            </Button>
                                        </Stack>
                                    </Box>
                                )}
                                {selectedTurno.estado === 'confirmado' && new Date() < selectedTurno.fechaHora && (
                                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2, fontSize: '0.85rem', textAlign: 'left' }}>
                                        Este turno está programado para el futuro y no puede marcarse como realizado todavía.
                                    </Alert>
                                )}
                            </DialogContent>
                            {!showCancelForm && !showChangeForm && (
                                <DialogActions sx={{ p: 2, gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                    {puedesCancelar && (
                                        <Button onClick={() => setShowCancelForm(true)} color="error" variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                                            Cancelar
                                        </Button>
                                    )}
                                    {puedesCancelar && (
                                        <Button onClick={() => setShowChangeForm(true)} color="primary" variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                                            Cambio
                                        </Button>
                                    )}
                                    {selectedTurno.estado === 'reservado' && (
                                        <Button onClick={handleConfirmar} color="primary" variant="contained" disabled={actionLoading} startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : null} sx={{ borderRadius: 2 }}>
                                            Confirmar
                                        </Button>
                                    )}
                                    {selectedTurno.estado === 'confirmado' && (
                                        <Button onClick={handleRealizar} color="success" variant="contained" disabled={actionLoading || new Date() < selectedTurno.fechaHora} startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : null} sx={{ borderRadius: 2 }}>
                                            Realizado
                                        </Button>
                                    )}
                                </DialogActions>
                            )}
                        </>
                    )}
                </Dialog>

                {/* ─── SNACKBAR ─── */}
                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert severity={snackbar.tipo} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} sx={{ width: '100%', borderRadius: 2 }}>
                        {snackbar.mensaje}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}

export default AgendaMedica;