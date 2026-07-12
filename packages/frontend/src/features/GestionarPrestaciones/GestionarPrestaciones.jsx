import React, { useState, useEffect } from 'react';
import {
    Typography,
    TextField,
    Button,
    Card,
    Box,
    MenuItem,
    Stack,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    Chip,
    Divider
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');

const API_BASE = API_BASE_URL;

const GestionarPrestaciones = () => {
    const [medico, setMedico] = useState(null);
    const [serviciosCatalogo, setServiciosCatalogo] = useState([]);
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Alta Prestacion Form State
    const [nuevoServicioId, setNuevoServicioId] = useState('');
    const [nuevoCosto, setNuevoCosto] = useState('');
    const [nuevaDuracion, setNuevaDuracion] = useState('20');
    const [nuevoCodigo, setNuevoCodigo] = useState('');

    // Edit Prestacion Modal State
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingPrestacion, setEditingPrestacion] = useState(null);
    const [editCosto, setEditCosto] = useState('');
    const [editDuracion, setEditDuracion] = useState('');

    const token = localStorage.getItem("token");

    const getHeaders = () => ({
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const showMsg = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Obtener datos del médico logueado
            const medicoRes = await axios.get(`${API_BASE}/medicos/me`, getHeaders());
            setMedico(medicoRes.data);

            // 2. Obtener catálogo completo de servicios usando "limit" para que el backend responda con todos
            const serviciosRes = await axios.get(`${API_BASE}/servicios?limit=100`, getHeaders());
            setServiciosCatalogo(serviciosRes.data.data || []);
        } catch (error) {
            console.error("Error al cargar datos de configuración médica:", error);
            showMsg("No se pudo cargar la información médica del servidor.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 1. Alta de Prestación
    const handleAltaPrestacion = async (e) => {
        e.preventDefault();
        if (!nuevoServicioId || !nuevoCosto || !nuevaDuracion) {
            showMsg("Por favor, complete todos los campos obligatorios.", "warning");
            return;
        }

        const servicioSeleccionado = serviciosCatalogo.find(s => s.id === nuevoServicioId);
        if (!servicioSeleccionado) return;

        const esPractica = servicioSeleccionado.tipoServicio === 'practica';
        if (esPractica && !nuevoCodigo.trim()) {
            showMsg("Debe ingresar un código único para las prácticas médicas.", "warning");
            return;
        }

        setActionLoading(true);
        try {
            const payload = {
                servicioUnico: nuevoServicioId,
                costo: parseFloat(nuevoCosto),
                duracionTurnoEnMins: parseInt(nuevaDuracion),
                tipoServicio: servicioSeleccionado.tipoServicio,
                ...(esPractica ? { codigo: nuevoCodigo.trim() } : {})
            };

            await axios.post(`${API_BASE}/medicos/${medico.id}/prestaciones`, payload, getHeaders());
            showMsg("Prestación médica agregada exitosamente.");
            
            // Resetear form
            setNuevoServicioId('');
            setNuevoCosto('');
            setNuevaDuracion('20');
            setNuevoCodigo('');
            
            // Recargar datos
            await fetchData();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "No se pudo agregar la prestación.";
            showMsg(errorMsg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    // 2. Modificación de Prestación (Abrir Modal)
    const handleOpenEdit = (prestacion) => {
        setEditingPrestacion(prestacion);
        setEditCosto(prestacion.costo);
        setEditDuracion(prestacion.duracionTurnoEnMins);
        setOpenEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!editCosto || !editDuracion) {
            showMsg("Por favor complete los campos obligatorios.", "warning");
            return;
        }

        setActionLoading(true);
        try {
            const payload = {
                servicioUnico: editingPrestacion.servicioUnico?._id || editingPrestacion.servicioUnico,
                costo: parseFloat(editCosto),
                duracionTurnoEnMins: parseInt(editDuracion),
                tipoServicio: editingPrestacion.tipoServicio,
                ...(editingPrestacion.tipoServicio === 'practica' ? { codigo: editingPrestacion.codigo } : {})
            };

            await axios.patch(
                `${API_BASE}/medicos/${medico.id}/prestaciones/${editingPrestacion._id || editingPrestacion.id}`,
                payload,
                getHeaders()
            );

            showMsg("Prestación médica actualizada exitosamente.");
            setOpenEditModal(false);
            setEditingPrestacion(null);
            await fetchData();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "No se pudo actualizar la prestación.";
            showMsg(errorMsg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    // 3. Baja de Prestación (Borrado Lógico)
    const handleBajaPrestacion = async (idPrestacion) => {
        if (!window.confirm("¿Está seguro de que desea dar de baja esta prestación? (Se realizará una baja lógica para preservar registros pasados)")) {
            return;
        }

        setActionLoading(true);
        try {
            await axios.delete(`${API_BASE}/medicos/${medico.id}/prestaciones/${idPrestacion}`, getHeaders());
            showMsg("Prestación dada de baja correctamente.");
            await fetchData();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "No se pudo dar de baja la prestación.";
            showMsg(errorMsg, "error");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
                <CustomSkeleton type="list" count={3} />
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

    const selectedServicio = serviciosCatalogo.find(s => s.id === nuevoServicioId);
    const esNuevoServicioPractica = selectedServicio?.tipoServicio === 'practica';

    // Combinar especialidades y prácticas del médico para listarlas
    const prestacionesMedico = [
        ...(medico?.especialidades || []).map(p => ({ ...p, tipoServicio: 'especialidad' })),
        ...(medico?.practicas || []).map(p => ({ ...p, tipoServicio: 'practica' }))
    ];

    // Filtrar servicios del catálogo para no listar los que ya presta
    const serviciosDisponiblesParaAsociar = serviciosCatalogo.filter(
        sc => !prestacionesMedico.some(pm => {
            const sId = pm.servicioUnico?._id || pm.servicioUnico?.id || pm.servicioUnico;
            return sId === sc.id;
        })
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Header de la sección */}
            <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main', mb: 1 }}>
                    <LocalHospitalIcon />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', tracking: 'wider' }}>
                        Configuración Profesional
                    </Typography>
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Gestión de Prestaciones
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    Administre sus especialidades y prácticas médicas activas.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Panel Izquierdo: Formularios de Alta */}
                <Grid item xs={12} lg={4}>
                    <Card variant="outlined" sx={{ p: 3, bgcolor: 'background.paper', textAlign: 'left' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AddIcon color="primary" /> Asociar Servicio Médico
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box component="form" onSubmit={handleAltaPrestacion}>
                            <Stack spacing={2.5}>
                                <TextField
                                    select
                                    label="Seleccione Servicio de Catálogo"
                                    value={nuevoServicioId}
                                    onChange={(e) => setNuevoServicioId(e.target.value)}
                                    required
                                >
                                    {serviciosDisponiblesParaAsociar.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.nombre} ({s.tipoServicio === 'practica' ? 'Práctica' : 'Especialidad'})
                                        </MenuItem>
                                    ))}
                                    {serviciosDisponiblesParaAsociar.length === 0 && (
                                        <MenuItem disabled>No hay más servicios para asociar</MenuItem>
                                    )}
                                </TextField>

                                {esNuevoServicioPractica && (
                                    <TextField
                                        label="Código de la Práctica"
                                        value={nuevoCodigo}
                                        onChange={(e) => setNuevoCodigo(e.target.value)}
                                        placeholder="ej. PRAC-204"
                                        required
                                        helperText="Las prácticas médicas requieren un código identificador."
                                    />
                                )}

                                <TextField
                                    label="Costo de la Consulta ($)"
                                    type="number"
                                    value={nuevoCosto}
                                    onChange={(e) => setNuevoCosto(e.target.value)}
                                    required
                                    inputProps={{ min: 0, step: "0.01" }}
                                />

                                <TextField
                                    select
                                    label="Duración del Turno"
                                    value={nuevaDuracion}
                                    onChange={(e) => setNuevaDuracion(e.target.value)}
                                    required
                                >
                                    <MenuItem value="15">15 minutos</MenuItem>
                                    <MenuItem value="20">20 minutos</MenuItem>
                                    <MenuItem value="30">30 minutos</MenuItem>
                                    <MenuItem value="45">45 minutos</MenuItem>
                                    <MenuItem value="60">60 minutos</MenuItem>
                                </TextField>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={actionLoading}
                                    startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    fullWidth
                                >
                                    Asociar Servicio
                                </Button>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                {/* Panel Derecho: Tabla de Prestaciones Activas */}
                <Grid item xs={12} lg={8}>
                    <Card variant="outlined" sx={{ p: 3, bgcolor: 'background.paper' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ textAlign: 'left' }}>
                            Mis Prestaciones Activas
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />

                        {prestacionesMedico.length === 0 ? (
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                                <Typography variant="body1" color="text.secondary">
                                    Aún no ha configurado ninguna especialidad o práctica.
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Utilice el panel de la izquierda para agregar su primer servicio médico.
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                <Table sx={{ minWidth: 600 }}>
                                    <TableHead sx={{ bgcolor: 'background.default' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Costo ($)</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Duración</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {prestacionesMedico.map((p) => (
                                            <TableRow key={p._id || p.id} hover>
                                                <TableCell sx={{ fontWeight: 600 }}>
                                                    {p.servicioUnico?.nombre || p.nombre || "Servicio no especificado"}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={p.tipoServicio === 'practica' ? 'Práctica' : 'Especialidad'}
                                                        color={p.tipoServicio === 'practica' ? 'secondary' : 'primary'}
                                                        size="small"
                                                        sx={{ fontWeight: 'bold', borderRadius: 2 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {p.codigo ? <code>{p.codigo}</code> : <Typography variant="caption" color="text.secondary">-</Typography>}
                                                </TableCell>
                                                <TableCell>${p.costo?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell>{p.duracionTurnoEnMins} mins</TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleOpenEdit(p)}
                                                            disabled={actionLoading}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleBajaPrestacion(p._id || p.id)}
                                                            disabled={actionLoading}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Stack>
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

            {/* Modal de Edición de Prestación */}
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Modificar Prestación</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Stack spacing={3}>
                            <Typography variant="body2" color="text.secondary">
                                Servicio: <strong>{editingPrestacion?.servicioUnico?.nombre || editingPrestacion?.nombre}</strong>
                            </Typography>

                            <TextField
                                label="Costo ($)"
                                type="number"
                                value={editCosto}
                                onChange={(e) => setEditCosto(e.target.value)}
                                required
                                inputProps={{ min: 0, step: "0.01" }}
                            />

                            <TextField
                                select
                                label="Duración del Turno"
                                value={editDuracion}
                                onChange={(e) => setEditDuracion(e.target.value)}
                                required
                            >
                                <MenuItem value="15">15 minutos</MenuItem>
                                <MenuItem value="20">20 minutes</MenuItem>
                                <MenuItem value="30">30 minutos</MenuItem>
                                <MenuItem value="45">45 minutos</MenuItem>
                                <MenuItem value="60">60 minutos</MenuItem>
                            </TextField>
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setOpenEditModal(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        variant="contained"
                        color="primary"
                        disabled={actionLoading}
                        startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        Guardar cambios
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Feedback user notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
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
};

export default GestionarPrestaciones;
