import { useEffect } from "react";
import { loginService } from "../../services/loginService";

const SessionManager = () => {
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    const interval = setInterval(async () => {
      try {
        const response = await loginService.refreshToken();

        localStorage.setItem("token", response.access_token);
        localStorage.setItem("refreshToken", response.refresh_token);

        console.log("token renovado");
      } catch (error) {
        console.log("sesión expirada");
        localStorage.clear();
        window.location.href = "/login";
      }
    }, 240000); // cada 4 minutos

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default SessionManager;