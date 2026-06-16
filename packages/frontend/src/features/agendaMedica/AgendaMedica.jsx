// src/features/medico/AgendaMedica.jsx
import React from 'react';
import { 
    Typography, 
    Card, 
    CardContent, 
    Avatar, 
    Box, 
    Stack 
} from '@mui/material';

// Íconos oficiales de Material-UI
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import './AgendaMedica.css';

// Rango de horas que atiende el Dr. Martínez
const horasAgenda = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const turnosMedicos = [
    {
        id: 1,
        paciente: 'Carlos Ruiz',
        motivo: 'Consulta Gral.',
        estado: 'completado',
        columna: 1, // Lunes
        top: 30,    // 09:30 AM (Mitad de la primera celda de 60px)
        height: 60  // 1 hora de duración
    },
    {
        id: 2,
        paciente: 'Elena Gómez',
        motivo: 'Control Post-Op',
        estado: 'reservado',
        columna: 2, // Martes
        top: 120,   // 11:00 AM
        height: 90  // 1 hora y media
    },
    {
        id: 3,
        paciente: 'Mateo Sosa',
        motivo: 'Primera vez',
        estado: 'pendiente',
        columna: 3, // Miércoles
        top: 360,   // 15:00 PM
        height: 60
    },
    {
        id: 4,
        paciente: 'Lucía Ferreyra',
        motivo: 'Recetas',
        estado: 'reservado',
        columna: 5, // Viernes
        top: 60,    // 10:00 AM
        height: 60
    }
];

const AgendaMedica = () => {

    // Función auxiliar para pintar el color del bloque según el estado del turno
    const obtenerEstilosEstado = (estado) => {
        switch (estado) {
            case 'completado':
                return { bg: '#e8f5e9', border: '#4caf50', texto: '#2e7d32', icono: <CheckCircleIcon sx={{ fontSize: 16 }} /> };
            case 'pendiente':
                return { bg: '#fff3e0', border: '#ff9800', texto: '#e65100', icono: <ErrorOutlineIcon sx={{ fontSize: 16 }} /> };
            case 'reservado':
            default:
                return { bg: '#e3f2fd', border: '#1976d2', texto: '#1565c0', icono: <EventIcon sx={{ fontSize: 16 }} /> };
        }
    };

    return (
        <div className="agenda-container">
            <main className="agenda-main-content">
                
                {/* 📊 Encabezado Simple */}
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        Agenda Médica
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Semana del 20 al 24 de Mayo, 2026
                    </Typography>
                </Box>

                {/* 📅 Estructura del Calendario Semanal */}
                <div className="calendar-wrapper">
                    
                    {/* Encabezado de los días */}
                    <div className="calendar-grid-structure" style={{ backgroundColor: '#f2f3fb' }}>
                        <div className="calendar-header-day"></div> {/* Celda vacía de la esquina */}
                        <div className="calendar-header-day">
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>LUN</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>20</Typography>
                        </div>
                        <div className="calendar-header-day" style={{ backgroundColor: 'rgba(0, 94, 184, 0.04)' }}>
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>MAR</Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>21</Typography>
                        </div>
                        <div className="calendar-header-day">
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>MIÉ</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>22</Typography>
                        </div>
                        <div className="calendar-header-day">
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>JUE</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>23</Typography>
                        </div>
                        <div className="calendar-header-day">
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>VIE</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>24</Typography>
                        </div>
                    </div>

                    {/* Cuerpo del Calendario con las Horas y bloques absolutos */}
                    <div className="calendar-grid-structure" style={{ height: `${horasAgenda.length * 60}px` }}>
                        
                        {/* Renderizamos las líneas de fondo del calendario */}
                        {horasAgenda.map((hora, indice) => (
                            <React.Fragment key={hora}>
                                <div className="time-row-cell time-label" style={{ gridRowStart: indice + 1 }}>
                                    {hora}
                                </div>
                                <div className="time-row-cell" style={{ gridRowStart: indice + 1 }}></div>
                                <div className="time-row-cell" style={{ gridRowStart: indice + 1 }}></div>
                                <div className="time-row-cell" style={{ gridRowStart: indice + 1 }}></div>
                                <div className="time-row-cell" style={{ gridRowStart: indice + 1 }}></div>
                                <div className="time-row-cell" style={{ gridRowStart: indice + 1 }}></div>
                            </React.Fragment>
                        ))}

                        {/* 🟥 RENDERIZADO DE LOS TURNOS */}
                        {turnosMedicos.map((turno) => {
                            const config = obtenerEstilosEstado(turno.estado);
                            return (
                                <Box
                                    key={turno.id}
                                    sx={{
                                        position: 'absolute',
                                        left: `calc(80px + ((100% - 80px) / 5) * ${turno.columna - 1} + 4px)`,
                                        width: `calc((100% - 80px) / 5 - 8px)`,
                                        top: `${turno.top}px`,
                                        height: `${turno.height}px`,
                                        bgcolor: config.bg,
                                        borderLeft: `4px solid ${config.border}`,
                                        borderRadius: '0 8px 8px 0',
                                        p: 1,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        transition: 'transform 0.2s',
                                        textAlign: 'left',
                                        '&:hover': { transform: 'scale(0.98)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                        <Typography sx={{ fontSize: '10px', fontWeight: 'bold', color: config.texto, textTransform: 'uppercase' }}>
                                            {turno.estado === 'pendiente' ? 'Cambio' : turno.estado}
                                        </Typography>
                                        <span style={{ color: config.border, display: 'flex' }}>{config.icono}</span>
                                    </Stack>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '13px' }} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {turno.paciente}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '11px' }} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {turno.motivo}
                                    </Typography>
                                </Box>
                            );
                        })}

                    </div>
                </div>

                {/* 📊 CONTENEDOR INFERIOR DE ESTADÍSTICAS */}
                <section className="stats-dashboard-grid" style={{ textAlign: 'left' }}>
                    {/* Tarjeta 1: Completados */}
                    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 48, height: 48 }}>
                                <TaskAltIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>24</Typography>
                                <Typography variant="body2" color="text.secondary">Turnos Completados</Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Tarjeta 2: Próximas Citas (🚀 CORREGIDA) */}
                    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 48, height: 48 }}>
                                <CalendarTodayIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>12</Typography>
                                <Typography variant="body2" color="text.secondary">Próximas Citas</Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Tarjeta 3: Cambios */}
                    <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#fff3e0', color: '#e65100', width: 48, height: 48 }}>
                                <NotificationImportantIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>3</Typography>
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