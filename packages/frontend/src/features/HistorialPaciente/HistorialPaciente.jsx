import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Avatar, Chip, Stack, Divider } from '@mui/material';
import { ArrowBack as ArrowBackIcon, History as HistoryIcon, Person as PersonIcon } from '@mui/icons-material';
import { CustomSkeleton } from '../../components/CustomSkeleton.jsx';

const estadoConfig = {
    COMPLETADO: { label: 'Completado', color: 'success' },
    REALIZADO: { label: 'Completado', color: 'success' },
    CONFIRMADO: { label: 'Confirmado', color: 'primary' },
    RESERVADO: { label: 'Confirmado', color: 'primary' },
    PENDIENTE: { label: 'Pendiente', color: 'warning' },
    CANCELADO: { label: 'Cancelado', color: 'error' }
};

export default function HistorialPaciente() {
    const { idPaciente } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [historial, setHistorial] = useState([]);
    const [pacienteInfo, setPacienteInfo] = useState(null);

    useEffect(() => {
        setLoading(true);

        // Acá iría el fetch al backend para traer el historial del paciente según idPaciente. Por ahora lo simulo con datos mock.
        if (idPaciente === 'carlos') {
            setPacienteInfo({ nombre: 'Carlos Ruiz', plan: 'Sancor Salud', documento: '35.123.456' });
            setHistorial([
                { id: 'h1', fecha: '10/05/2026', hora: '09:00', motivo: 'Consulta Gral.', estado: 'completado', medico: 'Dr. Rossi' },
                { id: 'h3', fecha: '15/06/2026', hora: '11:00', motivo: 'Control de Presión', estado: 'completado', medico: 'Dra. Fernández' },
                { id: 'h4', fecha: '20/07/2026', hora: '14:00', motivo: 'Chequeo Anual', estado: 'completado', medico: 'Dr. López' }

            ]);
        }

        setLoading(false);
    }, [idPaciente]);

    if (loading) {
        return (
            <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 6 }}>
                <CustomSkeleton type="table" count={4} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto', mt: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3, bgcolor: 'background.default' }}>
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: 'white' }}>
                        <PersonIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="h5" fontWeight={700}>
                            {pacienteInfo?.nombre}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            <strong>Obra Social: </strong>{pacienteInfo?.plan?.nombre || pacienteInfo?.plan || "No especificado"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            <strong>DNI: </strong>{pacienteInfo?.documento || pacienteInfo?.dni}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <HistoryIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>Historial de Consultas Pasadas</Typography>
                    </Box>

                    <Stack spacing={2}>
                        {historial.map((item, index) => {
                            const idTurno = item._id || item.id;
                            const cfg = estadoConfig[item.estado?.toUpperCase()] || estadoConfig.COMPLETADO;
                            return (
                                <Box key={idTurno}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1 }}>
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="body1" fontWeight={600}>
                                                {item.servicio?.nombre || item.motivo || "Consulta Médica"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                Fecha: {item.fechaHora ? new Date(item.fechaHora).toLocaleDateString() : item.fecha}
                                            </Typography>
                                        </Box>
                                        <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 600 }} />
                                    </Box>
                                    {index < historial.length - 1 && <Divider sx={{ mt: 1.5 }} />}
                                </Box>
                            );
                        })}

                        {historial.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                No se encontraron turnos anteriores para este paciente.
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}