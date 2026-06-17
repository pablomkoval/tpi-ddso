import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(
    <React.StrictMode>

        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
                onLoad: 'check-sso',          // No redirige automáticamente, solo verifica si hay sesión activa
                silentCheckSsoRedirectUri:    
                    window.location.origin + '/silent-check-sso.html',
                pkceMethod: 'S256',      // Método recomendado para aplicaciones SPAs    Sin PKCE, un atacante podría interceptar el authorization code durante el proceso de login e intentar canjearlo por tokens.  
            }}
        >
            <BrowserRouter>

                <ThemeProvider theme={theme}>
                    <CssBaseline />

                    <App />

                </ThemeProvider>

            </BrowserRouter>
        </ReactKeycloakProvider>

    </React.StrictMode>
);

reportWebVitals();

