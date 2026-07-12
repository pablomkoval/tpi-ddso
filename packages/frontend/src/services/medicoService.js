import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const getMiMedico = async () => {
    const response = await axios.get(`${API_BASE}/medicos/me`, getHeaders());
    return response.data;
};

export const getAgenda = async (medicoId, fechaDesde, fechaHasta) => {
    const response = await axios.get(`${API_BASE}/medicos/${medicoId}/agenda?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`, getHeaders());
    return response.data;
};

export const confirmarTurno = async (turnoId) => {
    const response = await axios.patch(
        `${API_BASE}/turnos/${turnoId}`,
        { estado: 'CONFIRMADO', rol: 'MEDICO' },
        getHeaders()
    );
    return response.data;
};

export const getHistorialTurnos = async (medicoId, page = 1, limit = 10) => {
    const response = await axios.get(`${API_BASE}/medicos/${medicoId}/turnos/historial?page=${page}&limit=${limit}`, getHeaders());
    return response.data;
};

export const realizarTurno = async (turnoId) => {
    const response = await axios.patch(
        `${API_BASE}/turnos/${turnoId}`,
        { estado: 'REALIZADO', rol: 'MEDICO' },
        getHeaders()
    );
    return response.data;
};

export const cancelarTurno = async (turnoId, motivo) => {
    const response = await axios.patch(
        `${API_BASE}/turnos/${turnoId}`,
        { estado: 'CANCELADO', rol: 'MEDICO', motivo },
        getHeaders()
    );
    return response.data;
};

export const proponerCambioTurno = async (turnoId, nuevoTurnoId, solicitanteId, motivo = '') => {
    const response = await axios.post(`${API_BASE}/solicitudes-cambio`, {
        turnoId,
        nuevoTurnoId,
        solicitanteId,
        motivo: motivo || 'Propuesta de cambio de fecha'
    }, getHeaders());
    return response.data;
};
