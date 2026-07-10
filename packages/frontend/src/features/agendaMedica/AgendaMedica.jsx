import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Avatar, Chip, Stack } from '@mui/material';
import { CheckCircle as CheckCircleIcon, History as HistoryIcon } from '@mui/icons-material';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

// Para los mocksss
import { turnosMedicos } from '../../mockdata/agendaMedicaData.js';

const estadoConfig = {
    COMPLETADO: { label: 'Completado', color: 'success' },
    REALIZADO:  { label: 'Completado', color: 'success' },
    CONFIRMADO: { label: 'Confirmado', color: 'primary' },
    RESERVADO:  { label: 'Confirmado', color: 'primary' },
    PENDIENTE:  { label: 'Pendiente',  color: 'warning' },
    CANCELADO:  { label: 'Cancelado',  color: 'error' }
};

export default function AgendaMedica() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [turnos, setTurnos] = useState([]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setTurnos(turnosMedicos);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleMarcarRealizado = (turnoId) => {
        setTurnos(prev => prev.map(t => t.id === turnoId ? { ...t, estado: 'completado' } : t));
    };

    const handleVerHistorial = (pacienteId) => {
        if (!pacienteId) return;
        navigate(`/historial/${pacienteId}`); 
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto', mt: 6 }}>
            <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>Agenda Médica</Typography>
            </Box>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 4 }}>
                <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, textAlign: 'left' }}>Turnos Asignados</Typography>

                    {loading ? ( <CustomSkeleton type="table" count={4} /> ) : (
                        <Stack spacing={1.5}>
                            {turnos.map((t) => {
                                const idActual = t._id || t.id;
                                
                                const nombrePaciente = typeof t.paciente === 'object' && t.paciente !== null
                                    ? t.paciente.nombre 
                                    : (t.paciente || "Paciente");

                                const idPacienteReal = typeof t.paciente === 'object' && t.paciente !== null
                                    ? (t.paciente._id || t.paciente.id) 
                                    : nombrePaciente;

                                const motivoConsulta = t.servicio?.nombre || t.motivo || 'Consulta';
                                const cfg = estadoConfig[t.estado?.toUpperCase()] || estadoConfig.CONFIRMADO;

                                return (
                                    <Box key={idActual} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'transparent', '&:hover': { borderColor: 'divider' } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                            <Avatar sx={{ width: 44, height: 44, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700 }}>
                                                {typeof nombrePaciente === 'string' && nombrePaciente.trim()
                                                    ? nombrePaciente.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                                    : 'P'}
                                            </Avatar>
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="body1" fontWeight={600}>{nombrePaciente}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    {motivoConsulta} · Horario: <strong>{t.hora || '09:00 hs'}</strong>
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 600 }} />
                                            <Stack direction="row" spacing={1.5}>
                                                <Button variant="outlined" color="primary" size="small" startIcon={<HistoryIcon />} onClick={() => handleVerHistorial(idPacienteReal)} sx={{ fontWeight: 600, textTransform: 'none' }}>
                                                    Ver Historial
                                                </Button>

                                                {t.estado?.toUpperCase() !== 'COMPLETADO' && t.estado?.toUpperCase() !== 'REALIZADO' && (
                                                    <Button variant="contained" color="success" size="small" startIcon={<CheckCircleIcon />} onClick={() => handleMarcarRealizado(idActual)} sx={{ fontWeight: 600, textTransform: 'none' }}>
                                                        Realizado
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}