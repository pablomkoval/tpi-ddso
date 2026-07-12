import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, Box, Typography } from '@mui/material';

import LoginPage from './features/LoginPage.jsx';
import NotificacionPage from './features/NotificacionPage.jsx';
import BuscarTurnos from './features/BuscarTurnos/BuscarTurnos.jsx';
import DefinirDisponibilidad from './features/DefinirDisponibilidad/DefinirDisponibilidad.jsx';
import AgendaMedica from './features/AgendaMedica/AgendaMedica.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import GestionarPrestaciones from './features/GestionarPrestaciones/GestionarPrestaciones.jsx';
import MisTurnos from './features/MisTurnos/MisTurnos.jsx';
import DetalleTurno from './features/BuscarTurnos/DetalleTurno.jsx';
import theme from './theme/theme.js';
import HomePage from './features/HomePage.jsx';
import RoleLayout from './features/RoleLayout.jsx';
import HistorialPaciente from './features/HistorialPaciente/HistorialPaciente.jsx';

const RootRedirect = () => {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            
                <Route path="/sin-permiso" element={
                    <Box sx={{ textAlign: 'center', p: { xs: 4, md: 8 }, mt: 6 }}>
                        <Typography variant="h4" fontWeight={700} color="error" gutterBottom>
                            Acceso denegado
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            No tenés permisos para ver esta página.
                        </Typography>
                    </Box>
                } />

                <Route path="/" element={
                    <PrivateRoute>
                        <RoleLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<RootRedirect />} />
                    <Route path="home" element={<HomePage />} />

                    {/* rutas de pacientes */}
                    <Route path="buscar-turnos" element={
                        <PrivateRoute requiredRole="paciente">
                            <BuscarTurnos />
                        </PrivateRoute>
                    } />
                    <Route path="mis-turnos" element={
                        <PrivateRoute requiredRole="paciente">
                            <MisTurnos />
                        </PrivateRoute>
                    } />
                    <Route path="turnos/:id" element={
                        <PrivateRoute requiredRole="paciente">
                            <DetalleTurno />
                        </PrivateRoute>
                    } />

                    {/* rutas de medicos */}
                    <Route path="definir-disponibilidad" element={
                        <PrivateRoute requiredRole="medico">
                            <DefinirDisponibilidad />
                        </PrivateRoute>
                    } />
                    <Route path="agenda-medica" element={
                        <PrivateRoute requiredRole="medico">
                            <AgendaMedica />
                        </PrivateRoute>
                    } />
                    <Route path="gestionar-prestaciones" element={
                        <PrivateRoute requiredRole="medico">
                            <GestionarPrestaciones />
                        </PrivateRoute>
                    } />

                    <Route path="notificaciones/" element={<NotificacionPage />} />

                    <Route path="historial-paciente/:idPaciente" element={
                        <PrivateRoute requiredRole="medico">
                            <HistorialPaciente />
                        </PrivateRoute>
                    } />
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;