import React, { useState } from 'react';
import './LoginBox.css';
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
    Typography
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
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
    const [role, setRole] = useState('paciente');
    const [showPassword, setShowPassword] = useState(false);

    const handleRoleChange = (_event, nextRole) => {
        if (nextRole !== null) {
            setRole(nextRole);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((currentValue) => !currentValue);
    };

    return (
        <Paper className="login-box" elevation={0}>
            <Stack className="login-box__content">
                <Box className="login-box__header">
                    <Typography component="h3" variant="h5">
                        Bienvenido de nuevo
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                        Selecciona tu perfil para ingresar
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    className="login-box__role-selector"
                    exclusive
                    value={role}
                    onChange={handleRoleChange}
                    aria-label="Seleccionar perfil"
                >
                    {roleOptions.map((option) => (
                        <ToggleButton
                            className="login-box__role-button"
                            key={option.value}
                            value={option.value}
                            aria-label={option.label}
                        >
                            <Stack className="login-box__role-content">
                                <Box className="login-box__role-icon">
                                    {option.icon}
                                </Box>

                                <Typography variant="body2">
                                    {option.label}
                                </Typography>
                            </Stack>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Box className="login-box__form" component="form" noValidate>
                    <Stack className="login-box__fields">
                        <TextField
                            label="Correo electrónico"
                            type="email"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            required
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
                            className="login-box__submit"
                            type="submit"
                            variant="contained"
                            endIcon={<LoginIcon />}
                            fullWidth
                        >
                            Ingresar a Sweet Medical
                        </Button>
                    </Stack>
                </Box>

                <Typography
                    className="login-box__register"
                    color="text.secondary"
                    variant="body2"
                >
                    ¿Aún no tiene cuenta?{' '}
                    <Link
                        component="button"
                        type="button"
                        underline="none"
                        onClick={onRegisterClick}
                    >
                        Regístrese aquí
                    </Link>
                </Typography>
            </Stack>
        </Paper>
    );
};

export default LoginBox;
