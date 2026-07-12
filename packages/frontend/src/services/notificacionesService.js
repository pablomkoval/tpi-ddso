import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');

const API_URL = `${API_BASE_URL}/notificaciones`;
const API_CAMBIO = API_BASE_URL;


export const obtenerNotificaciones = async (
    page = 1,
    limit = 10,
    leida
) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(API_URL, {
            params: {
                page,
                limit,
                ...(leida !== undefined && { leida })
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        throw error;
    }
};


export const obtenerCantidadNoLeidas = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${API_URL}/count`,
            {
                params: {
                    leida: false
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error al obtener cantidad de notificaciones no leídas:", error);
        throw error;
    }
};


export const obtenerResumenNotificaciones = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${API_URL}/resumen`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error al obtener resumen de notificaciones:", error);
        throw error;
    }
};


export const marcarNotificacionComoLeida = async (id) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${API_URL}/${id}/lecturas`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error al marcar notificación como leída:", error);
        throw error;
    }
};


export const marcarTodasComoLeidas = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${API_URL}/lecturas`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error al marcar todas las notificaciones como leídas:", error);
        throw error;
    }
};

export const confirmarSolicitudCambio = async (solicitudId, confirmadorId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.patch(
            `${API_CAMBIO}/solicitudes-cambio/${solicitudId}/confirmar`,
            { confirmadorId }, // Si el backend saca el ID del token, capaz no haga falta mandarlo
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error al confirmar solicitud de cambio:", error);
        throw error;
    }
};

export const rechazarSolicitudCambio = async (solicitudId, confirmadorId, motivoRechazo) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.patch(
            `${API_CAMBIO}/solicitudes-cambio/${solicitudId}/rechazar`,
            { confirmadorId, motivoRechazo },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error al rechazar solicitud de cambio:", error);
        throw error;
    }
};

export const getSolicitudesCambio = async (params) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${API_CAMBIO}/solicitudes-cambio`, 
            {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error("Error al obtener solicitudes de cambio:", error);
        throw error;
    }
};