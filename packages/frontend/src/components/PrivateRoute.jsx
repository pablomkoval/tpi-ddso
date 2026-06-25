import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRoles } from '../utils/authUtils';
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
    const roles = getUserRoles();

    if (!roles) {
        return <Navigate to="/login" replace />;
    }

    const esPaciente = roles.includes("paciente");
    const esMedico = roles.includes("medico");

    if (esPaciente && esMedico) {
        return <Navigate to="/sin-permiso" replace />;
    }

    if (requiredRole && !roles.includes(requiredRole)) {
        return <Navigate to="/sin-permiso" replace />;
    }

    return children;
};

export default PrivateRoute;

