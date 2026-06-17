import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { MedicalServices } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';

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
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);

        //opcional
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            localStorage.removeItem("token"); // Limpiamos el token viejo
            return <Navigate to="/login" replace />;
        }

        if (requiredRole) {
            const CLIENT_ID = "react-client"; 
            const rolesDelCliente = decoded.resource_access?.[CLIENT_ID]?.roles || [];
            
            if (!rolesDelCliente.includes(requiredRole)) {
                return <Navigate to="/sin-permiso" replace />;
            }
        }
        return children;
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;

