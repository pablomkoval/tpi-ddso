import React, { useState, useEffect } from 'react';
import {
    Typography, TextField, Button, Card, Box, MenuItem, Stack, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Snackbar, Alert, CircularProgress, Chip, Divider
} from '@mui/material';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import axios from 'axios';

import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');

const API_BASE = API_BASE_URL;
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const diasSemanaMap = {
    'Lunes': 1,
    'Martes': 2, 
    'Miércoles': 3, 
    'Jueves': 4, 
    'Viernes': 5, 
    'Sábado': 6, 
    'Domingo': 0
};

const diasSemanaMapReverse = {
    1: 'Lunes', 
    2: 'Martes', 
    3: 'Miércoles', 
    4: 'Jueves', 
    5: 'Viernes', 
    6: 'Sábado', 
    0: 'Domingo'
};

const DefinirDisponibilidad = () => {
    const [medico, setMedico] = useState(null);
    const [sedesCatalogo, setSedesCatalogo] = useState([]);
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [horaInicio, setHoraInicio] = useState('08:00');
    const [horaFin, setHoraFin] = useState('16:00');
    const [sede, setSede] = useState('');
    const [prestacion, setPrestacion] = useState('');

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const token = localStorage.getItem("token");
    const getHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

    const showMsg = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const medicoRes = await axios.get(`${API_BASE}/medicos/me`, getHeaders());
            setMedico(medicoRes.data);

            const sedesRes = await axios.get(`${API_BASE}/sedes`, getHeaders());
            const allSedes = sedesRes.data.data || [];
            setSedesCatalogo(allSedes);

            if (allSedes.length > 0) {
                setSede(allSedes[0]._id || allSedes[0].id);
            }

            const prestacionesMedico = [
                ...(medicoRes.data.especialidades || []),
                ...(medicoRes.data.practicas || [])
            ];
            if (prestacionesMedico.length > 0) {
                setPrestacion(prestacionesMedico[0]._id || prestacionesMedico[0].id);
            }
        } catch (error) {
            console.error("Error al cargar la información del médico y sedes:", error);
            showMsg("No se pudo cargar la información médica del servidor.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleDia = (dia) => {
        if (diasSeleccionados.includes(dia)) {
            setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia));
        } else {
            setDiasSeleccionados([...diasSeleccionados, dia]);
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        if (diasSeleccionados.length === 0) {
            showMsg("Debe seleccionar al menos un día de la semana.", "warning");
            return;
        }
        if (!sede) {
            showMsg("Debe seleccionar una sede.", "warning");
            return;
        }
        if (!prestacion) {
            showMsg("Debe seleccionar una prestación.", "warning");
            return;
        }

        setActionLoading(true);
        try {
            const payload = {
                disponibilidades: diasSeleccionados.map(dia => ({
                    diaSemana: diasSemanaMap[dia],
                    horaDesde: horaInicio,
                    horaHasta: horaFin,
                    sede: sede,
                    prestacion: prestacion
                }))
            };

            const response = await axios.post(`${API_BASE}/medicos/${medico.id || medico._id}/disponibilidades`, payload, getHeaders());
            setMedico(response.data);
            showMsg("Disponibilidad guardada exitosamente.");
            setDiasSeleccionados([]);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "No se pudo guardar la disponibilidad.";
            showMsg(errorMsg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    const handleEliminar = async (disponibilidadId) => {
        if (!window.confirm("¿Está seguro de que desea eliminar esta disponibilidad? Se cancelarán los turnos disponibles asociados.")) {
            return;
        }
        setActionLoading(true);
        try {
            const response = await axios.delete(
                `${API_BASE}/medicos/${medico.id || medico._id}/disponibilidades/${disponibilidadId}`,
                getHeaders()
            );
            setMedico(response.data);
            showMsg("Disponibilidad eliminada correctamente.");
        } catch (error) {
            const errorMsg = error.response?.data?.message || "No se pudo eliminar la disponibilidad.";
            showMsg(errorMsg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    const getSedeNombre = (sedeId) => {
        const idStr = String(sedeId?._id || sedeId);
        const found = sedesCatalogo.find(s => String(s._id || s.id) === idStr);
        return found ? found.nombre : 'Sede no especificada';
    };

    const getPrestacionNombre = (prestacionId) => {
        const idStr = String(prestacionId?._id || prestacionId);
        const prestacionesMedico = [
            ...(medico?.especialidades || []),
            ...(medico?.practicas || [])
        ];
        const found = prestacionesMedico.find(p => String(p._id || p.id) === idStr);
        return found ? (found.servicioUnico?.nombre || found.nombre) : 'Servicio no especificado';
    };

    const getTipoPrestacionLabel = (prestacionId) => {
        const idStr = String(prestacionId?._id || prestacionId);
        const esEspecialidad = medico?.especialidades?.some(e => String(e._id || e.id) === idStr);
        return esEspecialidad ? 'Especialidad' : 'Práctica';
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
                <CustomSkeleton type="detail" count={1} />
            </Box>
        );
    }

    if (!medico) {
        return (
            <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', textAlign: 'center', mt: 8 }}>
                <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
                    No se pudieron cargar los datos del médico
                </Typography>
                <Typography color="text.secondary" variant="body1" sx={{ mb: 3 }}>
                    Verifique que su usuario esté correctamente registrado como médico en el sistema y reinicie su servidor backend.
                </Typography>
                <Button variant="contained" onClick={fetchData} sx={{ px: 4 }}>
                    Reintentar cargar datos
                </Button>
            </Box>
        );
    }

    const prestacionesMedico = [
        ...(medico?.especialidades || []).map(p => ({ ...p, tipoServicio: 'especialidad' })),
        ...(medico?.practicas || []).map(p => ({ ...p, tipoServicio: 'practica' }))
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 3 }, minHeight: '85vh', bgcolor: '#f9f9ff' }}>
            <Box sx={{ flexGrow: 1, maxWidth: 1200, width: '100%' }}>

                {/* Cabecera */}
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main', mb: 1 }}>
                        <EventAvailableIcon />
                        <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Gestión Médica
                        </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Definir Disponibilidad
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Configure sus horarios de atención y prestaciones por sede.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Panel Izquierdo: Formulario */}
                    <Grid item xs={12} lg={4}>
                        <Card variant="outlined" sx={{ p: 3, bgcolor: 'background.paper', textAlign: 'left' }} component="form" onSubmit={handleGuardar}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EventAvailableIcon color="primary" /> Nueva Disponibilidad
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />

                            <Stack spacing={2.5}>
                                <Box sx={{ textAlign: 'left' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1.5 }}>
                                        Días de la Semana
                                    </Typography>
                                    <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                                        {diasSemana.map((dia) => {
                                            const activo = diasSeleccionados.includes(dia);
                                            return (
                                                <Button
                                                    key={dia}
                                                    type="button"
                                                    variant={activo ? "contained" : "outlined"}
                                                    color={activo ? "primary" : "inherit"}
                                                    onClick={() => toggleDia(dia)}
                                                    size="small"
                                                    sx={{ borderRadius: 2, px: 2, py: 0.5, textTransform: 'none', minWidth: '70px' }}
                                                >
                                                    {dia}
                                                </Button>
                                            );
                                        })}
                                    </Stack>
                                </Box>

                                <TextField label="Hora de Inicio" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <AccessTimeIcon color="action" sx={{ mr: 1 }} /> }} required />
                                <TextField label="Hora de Fin" type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <AccessTimeIcon color="action" sx={{ mr: 1 }} /> }} required />

                                <TextField select label="Prestación" value={prestacion} onChange={(e) => setPrestacion(e.target.value)} required>
                                    {prestacionesMedico.map((p) => (
                                        <MenuItem key={p._id || p.id} value={p._id || p.id}>
                                            {p.servicioUnico?.nombre || p.nombre} ({p.tipoServicio === 'practica' ? 'Práctica' : 'Especialidad'})
                                        </MenuItem>
                                    ))}
                                    {prestacionesMedico.length === 0 && (
                                        <MenuItem disabled>Configure primero sus prestaciones médicas</MenuItem>
                                    )}
                                </TextField>

                                <TextField select label="Sede de Atención" value={sede} onChange={(e) => setSede(e.target.value)} InputProps={{ startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} /> }} required>
                                    {sedesCatalogo.map((s) => (
                                        <MenuItem key={s._id || s.id} value={s._id || s.id}>
                                            {s.nombre} - {s.direccion}
                                        </MenuItem>
                                    ))}
                                    {sedesCatalogo.length === 0 && (
                                        <MenuItem disabled>No hay sedes registradas</MenuItem>
                                    )}
                                </TextField>

                                <Button type="submit" variant="contained" color="primary" disabled={actionLoading} startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} fullWidth>
                                    Guardar disponibilidad
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>

                    {/* Panel Derecho: Tabla */}
                    <Grid item xs={12} lg={8}>
                        <Card variant="outlined" sx={{ p: 3, bgcolor: 'background.paper' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalHospitalIcon color="primary" /> Mis Disponibilidades Activas
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />

                            {!medico.disponibilidades || medico.disponibilidades.length === 0 ? (
                                <Box sx={{ py: 6, textAlign: 'center' }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Aún no ha configurado ninguna disponibilidad horaria.
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Utilice el panel de la izquierda para configurar su primer horario de atención.
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                    <Table sx={{ minWidth: 600 }}>
                                        <TableHead sx={{ bgcolor: 'background.default' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Día</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Horario</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Sede</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Prestación</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {medico.disponibilidades.map((disp) => (
                                                <TableRow key={disp.id || disp._id} hover>
                                                    <TableCell sx={{ fontWeight: 600 }}>
                                                        {diasSemanaMapReverse[disp.diaSemana] || 'No especificado'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {disp.horaDesde} - {disp.horaHasta} hs
                                                    </TableCell>
                                                    <TableCell>
                                                        {getSedeNombre(disp.sede)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {getPrestacionNombre(disp.prestacion)}
                                                            </Typography>
                                                            <Chip
                                                                label={getTipoPrestacionLabel(disp.prestacion)}
                                                                size="small"
                                                                color={getTipoPrestacionLabel(disp.prestacion) === 'Práctica' ? 'secondary' : 'primary'}
                                                                sx={{ fontSize: '0.7rem', height: 18 }}
                                                                variant="contained"
                                                            />
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <IconButton color="error" size="small" onClick={() => handleEliminar(disp.id || disp._id)} disabled={actionLoading}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Card>
                    </Grid>
                </Grid>

                {/* Feedback Notifications */}
                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default DefinirDisponibilidad;