import axios from "axios";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');

const API_URL = API_BASE_URL;

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
      const errorMessage = error.response?.data?.message ||"Error al registrar usuario";
      throw new Error(errorMessage);
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