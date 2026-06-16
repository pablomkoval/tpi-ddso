import React, { useState } from 'react';
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

                    <Typography color="text.secondary" variant="body2">
                        Selecciona tu perfil para ingresar
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    exclusive
                    value={role}
                    onChange={handleRoleChange}
                    aria-label="Seleccionar perfil"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 2,
                        '& .MuiToggleButtonGroup-grouped': {
                            margin: 0,
                            border: '2px solid #f2f3fb !important',
                            borderRadius: '12px !important',
                        }
                    }}
                >
                    {roleOptions.map((option) => (
                        <ToggleButton
                            key={option.value}
                            value={option.value}
                            aria-label={option.label}
                            sx={{
                                width: '100%',
                                p: 2,
                                color: 'text.primary',
                                backgroundColor: '#f9f9ff',
                                textTransform: 'none',
                                transition: 'all 0.2s ease',
                                '&:hover, &.Mui-selected, &.Mui-selected:hover': {
                                    color: 'primary.main',
                                    backgroundColor: '#f0f7ff',
                                    borderColor: 'primary.main !important',
                                }
                            }}
                        >
                            <Stack sx={{ alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                    display: 'grid',
                                    width: '40px',
                                    height: '40px',
                                    placeItems: 'center',
                                    backgroundColor: 'background.paper',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                                    color: 'inherit'
                                }}>
                                    {option.icon}
                                </Box>

                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {option.label}
                                </Typography>
                            </Stack>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Box component="form" noValidate>
                    <Stack sx={{ gap: 3 }}>
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
                            type="submit"
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
                            Ingresar a Sweet Medical
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