import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    Card,
    CardContent,
    Avatar,
    Box,
    Stack,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Divider,
    IconButton,
    Snackbar,
    Alert,
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TextField
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckIcon from '@mui/icons-material/Check';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';

import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

import { horasAgenda, turnosMedicos, agendaStats, agendaSemana } from '../../mockdata/agendaMedicaData.js'
import { obtenerResumenNotificaciones } from '../../services/notificacionesService.js';

const formatearSemana = (inicio) => {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(inicio);
    fechaFin.setDate(fechaInicio.getDate() + 4);
    const mesInicio = fechaInicio.toLocaleDateString("es-AR", { month: "long" });
    const mesFin = fechaFin.toLocaleDateString("es-AR", { month: "long" });
    const anio = fechaInicio.getFullYear();
    if (mesInicio === mesFin) {
        return `Semana del ${fechaInicio.getDate()} al ${fechaFin.getDate()} de ${mesInicio}, ${anio}`;
    }
    return `${fechaInicio.getDate()} de ${mesInicio} – ${fechaFin.getDate()} de ${mesFin}, ${anio}`;
};

const AgendaMedica = () => {
    const [loading, setLoading] = useState(true);
    const [resumenNotificaciones, setResumenNotificaciones] = useState({
        total: 0,
        leidas: 0,
        noLeidas: 0,
    });

    // para el skeleton
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

            // Filtrar cancelados — no se muestran en la agenda
            const mappedTurnos = agendaData
                .filter(turno => turno.estado.toLowerCase() !== 'cancelado')
                .map(turno => {
                    const fecha = new Date(turno.fechaHora);
                    const diaSemana = fecha.getDay();
                    const columna = diaSemana === 0 ? 7 : diaSemana;

                    const horas = fecha.getHours();
                    const minutos = fecha.getMinutes();
                    const top = (horas - HORA_INICIO) * 60 + minutos;

                    const duracion = turno.servicio?.duracionMinutos ?? turno.servicio?.duracionTurnoEnMins ?? 30;
                    const height = Math.max(duracion, 40);

                    const pacienteNombre = turno.pacienteDetalle?.nombre || (turno.paciente ? "Paciente Registrado" : "Disponible");

                    return {
                        id: turno.id || turno._id,
                        paciente: pacienteNombre,
                        pacienteDni: turno.pacienteDetalle?.dni,
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
        }, 800);
        return () => clearTimeout(timer);
    }, []);

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

    // Cerrar dialog y resetear estados
    const cerrarDialog = () => {
        setOpenDialog(false);
        setSelectedTurno(null);
        setShowCancelForm(false);
        setMotivoCancelacion('');
        setShowChangeForm(false);
        setSelectedNuevoTurnoId('');
        setMotivoCambio('');
    };

    // Estilos por estado
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

    // ─── ACCIONES ───

    const handleConfirmar = async () => {
        if (!medico || !selectedTurno) return;
        try {
            setActionLoading(true);
            await confirmarTurno(medico.id || medico._id, selectedTurno.id);
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
            await realizarTurno(medico.id || medico._id, selectedTurno.id);
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
            await cancelarTurno(medico.id || medico._id, selectedTurno.id, motivoCancelacion.trim());
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
        const hoy = new Date();
        return t.fechaHora.toDateString() === hoy.toDateString() &&
            (t.estado === 'confirmado' || t.estado === 'reservado');
    }).length;
    const confirmados = turnos.filter(t => t.estado === 'confirmado').length;
    const pendientesConfirmacion = turnos.filter(t => t.estado === 'reservado').length;

    // Días de la semana
    const diasCabecera = [];
    const hoy = new Date();
    for (let i = 0; i < 5; i++) {
        const d = new Date(currentMonday);
        d.setDate(currentMonday.getDate() + i);
        diasCabecera.push({
            label: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'][i],
            numero: d.getDate(),
            esHoy: d.toDateString() === hoy.toDateString(),
            columna: i + 1
        });
    }

    // Indicador de hora actual
    const timeIndicatorTop = (hoy.getHours() - HORA_INICIO) * 60 + hoy.getMinutes();
    const showTimeIndicator = esEstaSemana() && hoy.getDay() >= 1 && hoy.getDay() <= 5 &&
        hoy.getHours() >= HORA_INICIO && hoy.getHours() <= 18;
    const todayCol = hoy.getDay();

    // ¿Se puede cancelar o reprogramar?
    const puedesCancelar = selectedTurno && (selectedTurno.estado === 'reservado' || selectedTurno.estado === 'confirmado');

    return (
        <div className="agenda-container">
            <main className="agenda-main-content">

                {/* ─── ENCABEZADO ─── */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Agenda Médica
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatearSemana(currentMonday)}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                            onClick={handleSemanaAnterior}
                            size="small"
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                        <Button
                            variant={esEstaSemana() ? "contained" : "outlined"}
                            size="small"
                            onClick={handleHoy}
                            startIcon={<TodayIcon />}
                            sx={{ borderRadius: 2, px: 2 }}
                        >
                            Hoy
                        </Button>
                        <IconButton
                            onClick={handleSemanaSiguiente}
                            size="small"
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Stack>
                </Box>

                {/* ─── TARJETAS DE ESTADÍSTICAS ─── */}
                <section className="stats-dashboard-grid" style={{ marginBottom: 20 }}>
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
                            </Avatar>
                            <Box sx={{ textAlign: 'left' }}>
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
                </section>

                {/* ─── CALENDARIO SEMANAL ─── */}
                <div className="calendar-wrapper">
                    {/* Header de días */}
                    <div className="calendar-grid-structure calendar-header">
                        <div className="calendar-header-day time-col-header"></div>
                        {diasCabecera.map((dia, idx) => (
                            <div
                                key={idx}
                                className={`calendar-header-day ${dia.esHoy ? 'today-header' : ''}`}
                            >
                                <Typography variant="caption" sx={{
                                    color: dia.esHoy ? 'primary.main' : 'text.secondary',
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem'
                                }}>
                                    {dia.label}
                                </Typography>
                                <Typography variant="h6" sx={{
                                    fontWeight: 'bold',
                                    color: dia.esHoy ? 'primary.main' : 'text.primary',
                                    fontSize: '1.1rem'
                                }}>
                                    {dia.numero}
                                </Typography>
                                {dia.esHoy && (
                                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', mx: 'auto', mt: 0.3 }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {loading && turnos.length === 0 ? (
                        <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                            <CustomSkeleton type="table" count={5} />
                        </Box>
                    ) : (
                        <div className="calendar-body-wrapper">
                            <div className="calendar-grid-structure calendar-body" style={{ height: `${horasAgenda.length * 60}px` }}>
                                {horasAgenda.map((hora, indice) => (
                                    <React.Fragment key={hora}>
                                        <div className="time-row-cell time-label" style={{ gridRowStart: indice + 1 }}>
                                            {hora}
                                        </div>
                                        {[1, 2, 3, 4, 5].map(col => (
                                            <div
                                                key={col}
                                                className={`time-row-cell ${diasCabecera[col - 1]?.esHoy ? 'today-column' : ''}`}
                                                style={{ gridRowStart: indice + 1 }}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}

                                {/* Indicador de hora actual */}
                                {showTimeIndicator && (
                                    <div
                                        className="time-now-indicator"
                                        style={{
                                            top: `${timeIndicatorTop}px`,
                                            left: `calc(80px + ((100% - 80px) / 5) * ${todayCol - 1})`,
                                            width: `calc((100% - 80px) / 5)`
                                        }}
                                    >
                                        <div className="time-now-dot" />
                                        <div className="time-now-line" />
                                    </div>
                                )}

                                {/* Turnos */}
                                {turnos.filter(t => t.columna >= 1 && t.columna <= 5).map((turno) => {
                                    const config = obtenerEstilosEstado(turno.estado);
                                    return (
                                        <Box
                                            key={turno.id}
                                            onClick={() => {
                                                setSelectedTurno(turno);
                                                setOpenDialog(true);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                left: `calc(80px + ((100% - 80px) / 5) * ${turno.columna - 1} + 3px)`,
                                                width: `calc((100% - 80px) / 5 - 6px)`,
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
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                                                    zIndex: 3
                                                }
                                            }}
                                        >
                                            <Typography sx={{
                                                fontSize: '9px',
                                                fontWeight: 'bold',
                                                color: config.texto,
                                                textTransform: 'uppercase',
                                                mb: 0.25
                                            }}>
                                                {config.label}
                                            </Typography>
                                            <Typography variant="body2" noWrap sx={{ fontWeight: 'bold', fontSize: '12px' }}>
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
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── HISTÓRICO DE TURNOS REALIZADOS ─── */}
                <Box sx={{ mt: 4 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <HistoryIcon sx={{ color: 'text.secondary' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
                                                            {fecha.toLocaleDateString("es-AR", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {fecha.toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })} hs
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {turno.pacienteDetalle?.nombre || 'Paciente'}
                                                        </Typography>
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
                                <Button 
                                    size="small"
                                    disabled={historialPage === 0} 
                                    onClick={() => setHistorialPage(p => p - 1)}
                                >
                                    Anterior
                                </Button>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Página {historialPage + 1} de {Math.ceil(historialTotal / HISTORIAL_ROWS)}
                                </Typography>
                                <Button 
                                    size="small"
                                    disabled={(historialPage + 1) * HISTORIAL_ROWS >= historialTotal} 
                                    onClick={() => setHistorialPage(p => p + 1)}
                                >
                                    Siguiente
                                </Button>
                            </Box>
                        )}
                    </Card>
                </Box>

                {/* ─── DIALOG DETALLE DEL TURNO ─── */}
                <Dialog
                    open={openDialog}
                    onClose={cerrarDialog}
                    PaperProps={{ sx: { borderRadius: 3, minWidth: 370, maxWidth: 430 } }}
                >
                    {selectedTurno && (
                        <>
                            {/* Header */}
                            <Box sx={{ p: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        Detalle del Turno
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2, mt: 0.3 }}>
                                        {selectedTurno.paciente}
                                    </Typography>
                                    {selectedTurno.pacienteDni && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                            DNI: {selectedTurno.pacienteDni}
                                        </Typography>
                                    )}
                                </Box>
                                <IconButton onClick={cerrarDialog} size="small">
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#fff3e0', color: '#e65100', width: 48, height: 48 }}>
                                <NotificationImportantIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {resumenNotificaciones.noLeidas}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">Cambios Solicitados</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </section>

            </main>
        </div>
    );
};

export default AgendaMedica;
