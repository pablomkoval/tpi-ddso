import axios from 'axios';

const API_URL = 'http://localhost:4000/notificaciones';


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