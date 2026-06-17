import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { MedicalServices } from '@mui/icons-material';
import useAuth from '../services/useAuth';

/**
 * Componente que protege rutas privadas.
 * - Si Keycloak está cargando: muestra un spinner.
 * - Si el usuario NO está autenticado: redirige a /login.
 * - Si se especifica `requiredRole` y el usuario NO lo tiene: redirige a /sin-permiso.
 * - Si el usuario SÍ está autenticado (y tiene el rol): renderiza los children.
 *
 * Uso básico (solo autenticación):
 *   <PrivateRoute><MiComponente /></PrivateRoute>
 *
 * Uso con rol requerido:
 *   <PrivateRoute requiredRole="medico"><AgendaMedica /></PrivateRoute>
 *   <PrivateRoute requiredRole="paciente"><BuscarTurnos /></PrivateRoute>
 */
const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, isLoading, hasRole } = useAuth();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    gap: 2,
                }}
            >
                <MedicalServices color="primary" sx={{ fontSize: 48 }} />
                <CircularProgress color="primary" />
                <Typography variant="body1" color="text.secondary">
                    Verificando sesión...
                </Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/sin-permiso" replace />;
    }

    return children;
};

export default PrivateRoute;

