import axios from "axios";

const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL || "http://localhost:8080";
const REALM = process.env.REACT_APP_KEYCLOAK_REALM || "tpi-realm";
const CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "react-client";

const USE_MOCK = process.env.REACT_APP_USE_MOCK_API === 'true';

export const loginService = {
  login: async (username, password) => {

    if (USE_MOCK) {
      console.warn("Usando MOCK API para el Login. No se conecta a Keycloak.");
      await new Promise(resolve => setTimeout(resolve, 1000));


      if (username === "admin" && password === "admin") {
        return {
          access_token: "mock_token_falso_123456789",
          expires_in: 3600
        };
      } else {
        throw new Error("Credenciales invalidas (Mock)");
      }
    }
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", CLIENT_ID);
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await axios.post(
        `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("RESPUESTA KEYCLOAK:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en Keycloak:", error.response?.data);
      throw new Error("Credenciales inválidas");
    }
  }
};