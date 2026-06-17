import { useKeycloak } from '@react-keycloak/web';

/**
 * Custom hook que abstrae el acceso a Keycloak.
 * Usá este hook en tus componentes en vez de useKeycloak directamente,
 * así si en el futuro cambiás el proveedor de auth, solo cambiás este archivo.
 *
 * @returns {{
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   user: { username: string, email: string, nombre: string, apellido: string, roles: string[] } | null,
 *   token: string | undefined,
 *   login: () => void,
 *   logout: () => void,
 *   hasRole: (role: string) => boolean
 * }}
 */
const useAuth = () => {
    const { keycloak, initialized } = useKeycloak();

    const isAuthenticated = initialized && keycloak.authenticated;

    const user = isAuthenticated
        ? {
              username: keycloak.tokenParsed?.preferred_username,
              email: keycloak.tokenParsed?.email,
              nombre: keycloak.tokenParsed?.given_name,
              apellido: keycloak.tokenParsed?.family_name,
              roles: keycloak.tokenParsed?.realm_access?.roles || [],
          }
        : null;

    /**
     * Verifica si el usuario tiene un rol específico definido en Keycloak.
     * @param {string} role
     * @returns {boolean}
     */
    const hasRole = (role) => {
        return keycloak.hasRealmRole(role);
    };

    return {
        isAuthenticated,
        isLoading: !initialized,
        user,
        token: keycloak.token,
        login: () => keycloak.login(),
        logout: () => keycloak.logout({ redirectUri: window.location.origin }),
        hasRole,
        keycloak, // por si necesitás acceso directo en algún caso especial
    };
};

export default useAuth;
