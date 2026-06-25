import { jwtDecode } from "jwt-decode";

export const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "Invitado";
    
    try {
        const decoded = jwtDecode(token);
        return decoded.given_name || "Usuario";
    } catch (e) {
        return "Usuario";
    } 
};

export const getUserRoles = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return null;
        }

        const CLIENT_ID = "react-client";

        return decoded.resource_access?.[CLIENT_ID]?.roles || [];
    } catch {
        localStorage.removeItem("token");
        return null;
    }
};