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