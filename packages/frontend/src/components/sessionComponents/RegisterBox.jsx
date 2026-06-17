import React, { useState, useEffect } from 'react';
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
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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
import { registerService } from "../../services/registerService";

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
    matricula: '',
    especialidades: '',
    practicas: '',
    sedes: ''
};

const splitIds = (value) =>
    value
        ? value.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

const buildRegisterPayload = (role, form) => {
    return {
        endpoint: '/auth/register',
        body: {
            role,
            username: form.usuario,
            password: form.password,
            nombre: form.nombre,

            ...(role === 'paciente' && {
                dni: form.dni,
                obraSocial: form.obraSocial,
                plan: form.plan
            }),

            ...(role === 'medico' && {
                matricula: form.matricula,
                especialidades: splitIds(form.especialidades),
                practicas: splitIds(form.practicas),
                sedes: splitIds(form.sedes)
            })
        }
    };
};

const RegisterBox = ({ onLoginClick, onRegister }) => {
    const [listaObrasSociales, setListaObrasSociales] = useState([]);
    const [listaPlanes, setListaPlanes] = useState([]);
    const [role, setRole] = useState('paciente');
    const [form, setForm] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    
    // Estados para alertas
    const [errorMsg, setErrorMsg] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchObrasSociales = async () => {
            try {
                const data = await registerService.getObrasSociales();
                setListaObrasSociales(data);
            } catch (error) {
                console.error("Error cargando obras sociales:", error);
            }
        };
        fetchObrasSociales();
    }, []);

    const handleRoleChange = (_event, nextRole) => {
        if (nextRole !== null) {
            setRole(nextRole);
            setErrorMsg(null);
            setIsSuccess(false);
        }
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    };

    const handleObraSocialChange = (event) => {
        const osId = event.target.value;

        setForm(prev => ({ ...prev, obraSocial: osId, plan: '' }));

        const osEncontrada = listaObrasSociales.find(os => os._id === osId);
        if (osEncontrada) {
            setListaPlanes(osEncontrada.planes || []);
        } else {
            setListaPlanes([]);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((currentValue) => !currentValue);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMsg(null); 
        setIsSuccess(false);

        if (role === 'paciente' && (!form.obraSocial || !form.plan)) {
            setErrorMsg("Por favor, seleccione una Obra Social y un Plan.");
            return;
        }

        const registerPayload = buildRegisterPayload(role, form);

        try {
            await registerService.register(registerPayload);
            setIsSuccess(true);

            // Redirige al login después de 2 segundos de éxito
            setTimeout(() => {
                if (onLoginClick) onLoginClick();
            }, 2000);

        } catch (error) {
            setErrorMsg(error.message || "Error inesperado al registrar el usuario");
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

                {/* ALERTAS DE ERROR Y ÉXITO */}
                {errorMsg && (
                    <Alert severity="error" sx={{ alignItems: 'center' }}>
                        {errorMsg}
                    </Alert>
                )}

                {isSuccess && (
                    <Alert severity="success" sx={{ alignItems: 'center' }}>
                        ¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...
                    </Alert>
                )}

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
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            onClick={handleTogglePassword}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                                <FormControl fullWidth required>
                                    <InputLabel id="os-label">Obra social</InputLabel>
                                    <Select
                                        labelId="os-label"
                                        name="obraSocial"
                                        value={form.obraSocial}
                                        label="Obra social"
                                        onChange={handleObraSocialChange}
                                    >
                                        {listaObrasSociales.map((os) => (
                                            <MenuItem key={os._id} value={os._id}>
                                                {os.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth required disabled={!form.obraSocial}>
                                    <InputLabel id="plan-label">Plan</InputLabel>
                                    <Select
                                        labelId="plan-label"
                                        name="plan"
                                        value={form.plan}
                                        label="Plan"
                                        onChange={handleFieldChange}
                                    >
                                        {listaPlanes.map((plan) => (
                                            <MenuItem key={plan._id} value={plan._id}>
                                                {plan.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                            disabled={isSuccess} // Deshabilitamos si se está redirigiendo
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