import axios from "axios";

const API_URL = "http://localhost:8081";

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
};