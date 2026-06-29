import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    TextField, 
    Button, 
    Card, 
    Box,
    MenuItem,
    Stack
} from '@mui/material';

import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const DefinirDisponibilidad = () => {
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [horaInicio, setHoraInicio] = useState('08:00');
    const [horaFin, setHoraFin] = useState('16:00');
    const [duracion, setDuracion] = useState('20');
    const [sede, setSede] = useState('medrano');
    const [loading, setLoading] = useState(true);

    // para el skeleton :>
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const toggleDia = (dia) => {
        if (diasSeleccionados.includes(dia)) {
            setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia));
        } else {
            setDiasSeleccionados([...diasSeleccionados, dia]);
        }
    };

    const handleGuardar = (e) => {
        e.preventDefault();
        const payload = {
            dias: diasSeleccionados,
            inicio: horaInicio,
            fin: horaFin,
            duracionMinutos: parseInt(duracion),
            sedeId: sede
        };
        console.log("Datos listos para el Back:", payload);
    };

    return (
        <div className="disponibilidad-container">

            <main className="disponibilidad-main-content">
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'primary.main', mb: 1 }}>
                        <EventAvailableIcon />
                        <Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'uppercase', tracking: 'wider' }}>
                            Gestión Médica
                        </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Definir Disponibilidad
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Configure sus horarios de atención y duración de turnos por sede.
                    </Typography>
                </Box>

                {/* para el formulario */}
                {loading ? (
                    <CustomSkeleton type="detail" count={1} />
                ) : (
                    <Card variant="outlined" sx={{ p: 4, bgcolor: 'background.paper' }} component="form" onSubmit={handleGuardar}>
                        <div className="form-grid-disponibilidad">

                            <div className="col-span-full" style={{ textAlign: 'left' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1.5 }}>
                                    Día de la Semana
                                </Typography>
                                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" gap={1.5}>
                                    {diasSemana.map((dia) => {
                                        const activo = diasSeleccionados.includes(dia);
                                        return (
                                            <Button
                                                key={dia}
                                                type="button"
                                                variant={activo ? "contained" : "outlined"}
                                                color={activo ? "primary" : "inherit"}
                                                onClick={() => toggleDia(dia)}
                                                sx={{ borderRadius: 2, px: 3, py: 1, textTransform: 'none' }}
                                            >
                                                {dia}
                                            </Button>
                                        );
                                    })}
                                </Stack>
                            </div>

                            <TextField
                                label="Hora de Inicio"
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                                }}
                            />

                            <TextField
                                label="Hora de Fin"
                                type="time"
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                                }}
                            />

                            <TextField
                                select
                                label="Duración del Turno (Minutos)"
                                value={duracion}
                                onChange={(e) => setDuracion(e.target.value)}
                            >
                                <MenuItem value="15">15 minutos</MenuItem>
                                <MenuItem value="20">20 minutos</MenuItem>
                                <MenuItem value="30">30 minutos</MenuItem>
                                <MenuItem value="45">45 minutos</MenuItem>
                                <MenuItem value="60">60 minutos</MenuItem>
                            </TextField>

                            <TextField
                                select
                                label="Sede de Atención"
                                value={sede}
                                onChange={(e) => setSede(e.target.value)}
                                InputProps={{
                                    startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />
                                }}
                            >
                                <MenuItem value="medrano">Sede Medrano - Consultorio 402</MenuItem>
                                <MenuItem value="lugano">Sede Campus Lugano - Anexo Turnos</MenuItem>
                            </TextField>

                            <div className="col-span-full form-actions-row">
                                <Button variant="text" color="inherit" sx={{ textTransform: 'none' }}>
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                Ranger>
                                    Guardar disponibilidad
                                </Button>
                            </div>

                        </div>
                    </Card>
                )}

            </main>
        </div>
    );
};

export default DefinirDisponibilidad;