import Keycloak from 'keycloak-js';

let rawKeycloakUrl = process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080';
if (!rawKeycloakUrl.startsWith('http://') && !rawKeycloakUrl.startsWith('https://')) {
    rawKeycloakUrl = `https://${rawKeycloakUrl}`;
}

/**
 * Instancia de Keycloak configurada para el proyecto Sweet Medical.
 * Apunta al realm "tpi-realm" y al cliente público "react-client".
 */
const keycloak = new Keycloak({
    url: rawKeycloakUrl,
    realm: process.env.REACT_APP_KEYCLOAK_REALM || 'tpi-realm',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'react-client',
});

export default keycloak;
