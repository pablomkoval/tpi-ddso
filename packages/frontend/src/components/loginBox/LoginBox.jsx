import "./LoginBox.css";
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    Typography,
    Link,
    InputAdornment,
    IconButton
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
// const LoginBox = () => {
//     return (
//         <div>
//             <div className="logo_sweetmedical">
//                 <span className=""></span>
//             </div>
//         </div>
//     );
// };


import React, { useState } from 'react';
import './LoginBox.css';

const LoginBox = () => {
    const [role, setRole] = useState('paciente');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-box">

            <div className="login-header">
                <h3>Bienvenido de nuevo</h3>
                <p>Selecciona tu perfil para ingresar</p>
            </div>

            <div className="role-selector">

                <button
                    className={`role-button ${role === 'paciente' ? 'active' : ''}`}
                    onClick={() => setRole('paciente')}
                >
                    <div className="role-icon">👤</div>
                    <span>Paciente</span>
                </button>

                <button
                    className={`role-button ${role === 'profesional' ? 'active' : ''}`}
                    onClick={() => setRole('profesional')}
                >
                    <div className="role-icon">🏥</div>
                    <span>Profesional</span>
                </button>

            </div>

            <form>

                <Stack spacing={3}>

                    <TextField
                        label="Correo Electrónico"
                        type="email"
                        required
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '8px'
                            }}
                        >
                            <Typography variant="body2">
                                Contraseña
                            </Typography>

            
                        </div>

                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            label="Contraseña"
                            required
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),

                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                            >
                                                {showPassword
                                                    ? <VisibilityOffIcon />
                                                    : <VisibilityIcon />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />

                    </div>

                    <Button
                        type="submit"
                        variant="contained"
                        endIcon={<LoginIcon />}
                        fullWidth
                    >
                        Ingresar a Sweet Medical
                    </Button>

                </Stack>

            </form>

            <p className="register-footer">
                ¿Aún no tiene cuenta?
                {' '}
                <a href="#">
                    Regístrese aquí
                </a>
            </p>

        </div>
    );
};

export default LoginBox;


