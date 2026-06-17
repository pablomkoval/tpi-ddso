import axios from "axios";

const API_URL = "http://localhost:4000";

export const registerService = {
  register: async (payload) => {
    try {
      const response = await axios.post(
        `${API_URL}${payload.endpoint}`,
        payload.body
      );

      return response.data;
    } catch (error) {
      console.error(error.response?.data);
      throw new Error("Error al registrar usuario");
    }
  },

  getObrasSociales: async () => {
    try {
      const response = await axios.get(`${API_URL}/obras-sociales`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener obras sociales:", error);
      throw new Error("No se pudieron cargar las obras sociales.");
    }
  }
};