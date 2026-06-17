import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { MedicalServices } from "@mui/icons-material";
import useAuth from "../services/useAuth";

/**
 * Página de login.
 * Si el usuario ya está autenticado, lo redirige al inicio.
 * Si no, lo redirige automáticamente al login de Keycloak.
 */
const LoginPage = () => {
    const { isAuthenticated, isLoading, login, hasRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                // Ya tiene sesión, redirigir a la app
                navigate(hasRole('paciente') ? '/paciente' : '/medico', { replace: true });
            } else {
                // Redirigir a la página de login de Keycloak
                login();
            }
        }
    }, [isAuthenticated, isLoading, login, navigate]);

    // Mientras Keycloak verifica o redirige, mostrar pantalla de carga
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                gap: 3,
            }}
        >
            <MedicalServices
                color="primary"
                sx={{ fontSize: 64 }}
            />
            <Typography variant="h5" fontWeight="bold" color="primary">
                Sweet Medical
            </Typography>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary">
                Redirigiendo al inicio de sesión...
            </Typography>
        </Box>
    );
};

export default LoginPage;