import axios from 'axios';

const API_BASE = 'http://localhost:4000';
const API_URL = `${API_BASE}/notificaciones`;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const getNoLeidas = async (page = 1, limit = 5) => {
    const response = await axios.get(`${API_URL}/no-leidas?page=${page}&limit=${limit}`, getHeaders());
    return response.data;
};

export const getLeidas = async (page = 1, limit = 5) => {
    const response = await axios.get(`${API_URL}/leidas?page=${page}&limit=${limit}`, getHeaders());
    return response.data;
};

export const getNotificaciones = async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, getHeaders());
    return response.data;
};

export const marcarNotificacionComoLeida = async (idNotificacion) => {
    const response = await axios.post(`${API_URL}/${idNotificacion}/lecturas`, {}, getHeaders());
    return response.data;
};

export const eliminarNotificacion = async (idNotificacion) => {
    const response = await axios.delete(`${API_URL}/${idNotificacion}`, getHeaders());
    return response.data;
};

export const confirmarSolicitudCambio = async (solicitudId, confirmadorId) => {
    const response = await axios.patch(
        `${API_BASE}/solicitudes-cambio/${solicitudId}/confirmar`,
        { confirmadorId },
        getHeaders()
    );
    return response.data;
};

export const rechazarSolicitudCambio = async (solicitudId, confirmadorId, motivoRechazo) => {
    const response = await axios.patch(
        `${API_BASE}/solicitudes-cambio/${solicitudId}/rechazar`,
        { confirmadorId, motivoRechazo },
        getHeaders()
    );
    return response.data;
};

export const getSolicitudesCambio = async (params) => {
    const response = await axios.get(`${API_BASE}/solicitudes-cambio`, {
        params,
        ...getHeaders()
    });
    return response.data;
};