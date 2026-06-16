import React, { useState } from 'react';
import {
    Alert,
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
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const roleOptions = [
    {
        value: 'paciente',
        label: 'Paciente',
        icon: <PersonIcon />
    },
    {
        value: 'medico',
        label: 'Médico',
        icon: <LocalHospitalIcon />
    }
];

const initialForm = {
    usuario: '',
    password: '',
    nombre: '',
    dni: '',
    obraSocial: '',
    plan: '',
    matricula: ''
};

const splitIds = (value) =>
    value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

const buildRegisterPayload = (role, form) => {
    const basePayload = {
        usuario: form.usuario,
        password: form.password,
        nombre: form.nombre
    };

    if (role === 'paciente') {
        return {
            tipoPerfil: role,
            endpoint: '/pacientes',
            body: {
                ...basePayload,
                dni: form.dni,
                obraSocial: form.obraSocial || null,
                plan: form.plan || null
            }
        };
    }

    return {
        tipoPerfil: role,
        endpoint: '/medicos',
        body: {
            ...basePayload,
            matricula: form.matricula,
            especialidades: splitIds(form.especialidades),
            practicas: splitIds(form.practicas),
            sedes: splitIds(form.sedes)
        }
    };
};

const RegisterBox = ({ onLoginClick, onRegister }) => {
    const [role, setRole] = useState('paciente');
    const [form, setForm] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [submittedPayload, setSubmittedPayload] = useState(null);

    const handleRoleChange = (_event, nextRole) => {
        if (nextRole !== null) {
            setRole(nextRole);
            setSubmittedPayload(null);
        }
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    };

    const handleTogglePassword = () => {
        setShowPassword((currentValue) => !currentValue);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const registerPayload = buildRegisterPayload(role, form);
        setSubmittedPayload(registerPayload);

        if (onRegister) {
            onRegister(registerPayload);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                maxWidth: '520px',
                maxHeight: { xs: 'none', sm: 'calc(100vh - 64px)' },
                p: { xs: 3, sm: 5 },
                overflowY: 'auto',
                backgroundColor: 'background.paper',
                border: '1px solid #d8dae2',
                borderRadius: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Stack sx={{ gap: 3.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography component="h3" variant="h5" sx={{ fontWeight: 'bold' }}>
                        Crear cuenta
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                        Registrá un paciente o médico en Sweet Medical
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    exclusive
                    value={role}
                    onChange={handleRoleChange}
                    aria-label="Seleccionar tipo de cuenta"
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

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack sx={{ gap: 2.5 }}>
                        <TextField
                            label="Correo electrónico"
                            name="usuario"
                            type="email"
                            value={form.usuario}
                            onChange={handleFieldChange}
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
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={handleFieldChange}
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

                        <TextField
                            label="Nombre completo"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleFieldChange}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        {role === 'paciente' ? (
                            <>
                                <TextField
                                    label="DNI"
                                    name="dni"
                                    value={form.dni}
                                    onChange={handleFieldChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <BadgeIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <TextField
                                    label="Obra social"
                                    name="obraSocial"
                                    value={form.obraSocial}
                                    onChange={handleFieldChange}
                                    helperText="Por ejemplo: OSDE"
                                />

                                <TextField
                                    label="Numero de plan"
                                    name="plan"
                                    value={form.plan}
                                    onChange={handleFieldChange}
                                    helperText="Por ejemplo: 210"
                                />
                            </>
                        ) : (
                            <>
                                <TextField
                                    label="Matrícula"
                                    name="matricula"
                                    value={form.matricula}
                                    onChange={handleFieldChange}
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MedicalServicesIcon color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            endIcon={<PersonAddIcon />}
                            fullWidth
                            sx={{
                                boxShadow: '0 10px 25px rgba(0, 94, 184, 0.15)',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            Registrar cuenta
                        </Button>
                    </Stack>
                </Box>

                {submittedPayload && (
                    <Alert severity="success" sx={{ alignItems: 'center' }}>
                        Datos preparados para enviar a {submittedPayload.endpoint}
                    </Alert>
                )}

                <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center' }}>
                    ¿Ya tenés cuenta?{' '}
                    <Link
                        component="button"
                        type="button"
                        underline="none"
                        onClick={onLoginClick}
                        sx={{ fontWeight: 700, p: 0 }}
                    >
                        Ingresá aquí
                    </Link>
                </Typography>
            </Stack>
        </Paper>
    );
};

export default RegisterBox;