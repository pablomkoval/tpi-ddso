import React, { useState } from 'react';
import './RegisterBox.css';
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
        <Paper className="register-box" elevation={0}>
            <Stack className="register-box__content">
                <Box className="register-box__header">
                    <Typography component="h3" variant="h5">
                        Crear cuenta
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                        Registrá un paciente o médico en Sweet Medical
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    className="register-box__role-selector"
                    exclusive
                    value={role}
                    onChange={handleRoleChange}
                    aria-label="Seleccionar tipo de cuenta"
                >
                    {roleOptions.map((option) => (
                        <ToggleButton
                            className="register-box__role-button"
                            key={option.value}
                            value={option.value}
                            aria-label={option.label}
                        >
                            <Stack className="register-box__role-content">
                                <Box className="register-box__role-icon">
                                    {option.icon}
                                </Box>

                                <Typography variant="body2">
                                    {option.label}
                                </Typography>
                            </Stack>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Box
                    className="register-box__form"
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Stack className="register-box__fields">
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
                            className="register-box__submit"
                            type="submit"
                            variant="contained"
                            endIcon={<PersonAddIcon />}
                            fullWidth
                        >
                            Registrar cuenta
                        </Button>
                    </Stack>
                </Box>

                {submittedPayload && (
                    <Alert className="register-box__alert" severity="success">
                        Datos preparados para enviar a {submittedPayload.endpoint}
                    </Alert>
                )}

                <Typography
                    className="register-box__login"
                    color="text.secondary"
                    variant="body2"
                >
                    ¿Ya tenés cuenta?{' '}
                    <Link
                        component="button"
                        type="button"
                        underline="none"
                        onClick={onLoginClick}
                    >
                        Ingresá aquí
                    </Link>
                </Typography>
            </Stack>
        </Paper>
    );
};

export default RegisterBox;
