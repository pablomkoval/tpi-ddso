import Keycloak from 'keycloak-js';

const KEYCLOAK_URL = (process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080').replace(/\/+$/, '');
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM || 'tpi-realm';
const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'react-client';

/**
 * Instancia de Keycloak configurada para el proyecto Sweet Medical.
 * Apunta al realm "tpi-realm" y al cliente público "react-client".
 */
const keycloak = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
});

export default keycloak;
