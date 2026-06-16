import React, { useState } from 'react';
import { 
    Typography, 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    Avatar, 
    Box,
    MenuItem,
    Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './BuscarTurnos.css';

const listaEspecialidades = [
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'dermatologia', label: 'Dermatología' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'traumatologia', label: 'Traumatología' },
    { value: 'oftalmologia', label: 'Oftalmología' },
    { value: 'ginecologia', label: 'Ginecología' },
];

const turnosSimulados = [
    { 
        id: 1, 
        medico: 'Dr. Juan Pérez', 
        especialidad: 'CARDIOLOGÍA', 
        fecha: '2026-10-15', 
        fechaFormateada: '15 Oct, 2026',
        hora: '09:30 AM', 
        sede: 'Sede Medrano - Consultorio 102', 
        precio: 3500 
    },
    { 
        id: 2, 
        medico: 'Dra. Elena Rossi', 
        especialidad: 'DERMATOLOGÍA', 
        fecha: '2026-10-16', 
        fechaFormateada: '16 Oct, 2026',
        hora: '12:00 PM', 
        sede: 'Sede Campus Lugano - Aula Médica 05', 
        precio: 4200 
    }
];

const BuscarTurnos = () => {
    const [especialidad, setEspecialidad] = useState('');
    const [sede, setSede] = useState('');

    const [orden, setOrden] = useState('precio-asc');
    const [pagina, setPagina] = useState(1);

    const procesarOrdenamiento = (turnos) => {
        const turnosClonados = [...turnos];
        switch (orden) {
            case 'precio-asc':
                return turnosClonados.sort((a, b) => a.precio - b.precio);
            case 'precio-desc':
                return turnosClonados.sort((a, b) => b.precio - a.precio);
            case 'fecha-asc':
                return turnosClonados.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
            case 'fecha-desc':
                return turnosClonados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            default:
                return turnosClonados;
        }
    };

    const turnosOrdenados = procesarOrdenamiento(turnosSimulados);

    const handleCambioPagina = (event, value) => {
        setPagina(value);
    };

    return (
        <div className="buscar-turnos-container">
        
            <aside className="filtros-sidebar">
                <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
                    Filtros de Búsqueda
                </Typography>
                
                <TextField label="Nombre del Profesional" placeholder="Ej: Juan Pérez" />

                <TextField 
                    select 
                    label="Especialidad" 
                    value={especialidad} 
                    onChange={(e) => setEspecialidad(e.target.value)}
                >
                    <MenuItem value=""><em>Todas las especialidades</em></MenuItem>
                    {listaEspecialidades.map((esp) => (
                        <MenuItem key={esp.value} value={esp.value}>
                            {esp.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField label="Consultorio" placeholder="Cualquier consultorio" />
                
                <TextField 
                    select 
                    label="Ubicación (Sede)" 
                    value={sede} 
                    onChange={(e) => setSede(e.target.value)}
                >
                    <MenuItem value="all">Todas las sedes</MenuItem>
                    <MenuItem value="medrano">Sede Medrano</MenuItem>
                    <MenuItem value="lugano">Sede Campus Lugano</MenuItem>
                </TextField>

                <div className="rango-fechas-row">
                    <TextField label="Fecha Desde" type="date" InputLabelProps={{ shrink: true }} />
                    <TextField label="Fecha Hasta" type="date" InputLabelProps={{ shrink: true }} />
                </div>

                <Button variant="contained" color="primary" fullWidth startIcon={<SearchIcon />}>
                    Aplicar Filtros
                </Button>
            </aside>

            <main className="resultados-main">
                
                <div className="resultados-header">
                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold' }}>
                        Turnos Disponibles
                    </Typography>
                    
                    <TextField
                        select
                        label="Ordenar por"
                        value={orden}
                        onChange={(e) => setOrden(e.target.value)}
                        sx={{ width: '220px' }}
                        size="small"
                    >
                        <MenuItem value="precio-asc">Menor Precio</MenuItem>
                        <MenuItem value="precio-desc">Mayor Precio</MenuItem>
                        <MenuItem value="fecha-asc">Fecha: Próximos primero</MenuItem>
                        <MenuItem value="fecha-desc">Fecha: Lejanos primero</MenuItem>
                    </TextField>
                </div>
                {turnosOrdenados.map((turno) => (
                    <Card key={turno.id} variant="outlined" elevation={0}>
                        <CardContent className="medico-card-content">
                            
                            <div className="medico-info-block">
                                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 56, height: 56, fontWeight: 'bold' }}>
                                    {turno.medico.split(' ')[1][0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                        {turno.medico}
                                    </Typography>
                                    <Typography variant="caption" sx={{ bgcolor: 'primary.light', color: 'primary.main', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold', display: 'inline-block', mt: 0.5, mb: 1 }}>
                                        {turno.especialidad}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CalendarMonthIcon sx={{ fontSize: 16 }} />
                                        {turno.fechaFormateada} a las {turno.hora} | 📍 {turno.sede}
                                    </Typography>
                                </Box>
                            </div>

                            <div className="medico-action-block">
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                                    ${turno.precio}
                                </Typography>
                                
                                <Button variant="outlined" color="primary" size="small" fullWidth startIcon={<AddShoppingCartIcon />}>
                                    Agregar a preselección
                                </Button>

                                <Button variant="contained" color="primary" size="small" fullWidth startIcon={<CheckCircleOutlineIcon />}>
                                    Reservar
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                ))}
                <div className="paginacion-container">
                    <Pagination 
                        count={12} 
                        page={pagina} 
                        onChange={handleCambioPagina} 
                        color="primary" 
                        shape="rounded"
                    />
                </div>
            </main>

        </div>
    );
};

export default BuscarTurnos;