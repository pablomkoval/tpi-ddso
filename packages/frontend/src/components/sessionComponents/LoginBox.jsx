import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../../services/loginService';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Alert
} from '@mui/material';
import { Email } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const roleOptions = [
    {
        value: 'paciente',
        label: 'Paciente',
        icon: <PersonIcon />
    },
    {
        value: 'profesional',
        label: 'Profesional',
        icon: <LocalHospitalIcon />
    }
];

const LoginBox = ({ onRegisterClick }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [role, setRole] = useState('paciente');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRoleChange = (_event, nextRole) => {
        if (nextRole !== null) {
            setRole(nextRole);
            setError(null);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((currentValue) => !currentValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await loginService.login(username, password);
            
            localStorage.setItem("token", data.access_token);
            
            console.log("¡Login Exitoso como " + role + "!");
            navigate('/home');

        } catch (err) {
            setError(err.message || "Usuario o contraseña incorrectos");
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                maxWidth: '480px',
                p: { xs: 3, sm: 5 }, 
                backgroundColor: 'background.paper',
                border: '1px solid #d8dae2',
                borderRadius: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Stack sx={{ gap: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography component="h3" variant="h5" sx={{ fontWeight: 'bold' }}>
                        Bienvenido de nuevo
                    </Typography>

                </Box>


                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack sx={{ gap: 3 }}>

                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}
                        <TextField
                            label="Correo electrónico"
                            type="email"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            aria-label={
                                                showPassword
                                                    ? 'Ocultar contraseña'
                                                    : 'Mostrar contraseña'
                                            }
                                            onClick={handleTogglePassword}
                                        >
                                            {showPassword ? (
                                                <VisibilityOffIcon />
                                            ) : (
                                                <VisibilityIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            variant="contained"
                            endIcon={<LoginIcon />}
                            fullWidth
                            sx={{
                                boxShadow: '0 10px 25px rgba(0, 94, 184, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            {isLoading ? 'Ingresando...' : 'Ingresar a Sweet Medical'}
                        </Button>
                    </Stack>
                </Box>

                <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center' }}>
                    ¿Aún no tiene cuenta?{' '}
                    <Link
                        component="button"
                        type="button"
                        underline="none"
                        onClick={onRegisterClick}
                        sx={{ fontWeight: 700, p: 0 }}
                    >
                        Regístrese aquí
                    </Link>
                </Typography>
            </Stack>
        </Paper>
    );
};

export default LoginBox;