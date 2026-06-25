import axios from 'axios';

const API_URL = 'http://localhost:4000/notificaciones'; 

export const marcarNotificacionComoLeida = async (idNotificacion) => {
    const response = await axios.post(`${API_URL}/${idNotificacion}/lecturas`);
    return response.data;
};