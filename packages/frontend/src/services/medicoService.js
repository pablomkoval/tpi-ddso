import axios from 'axios';

const API_BASE = 'http://localhost:4000';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

/**
 * @param {string} medicoId
 * @param {string} turnoId
 * @returns {Promise<Object>}
*/
export const marcarTurnoRealizado = async (medicoId, turnoId) => {
    const response = await axios.post(`${API_BASE}/medicos/${medicoId}/turnos/${turnoId}/realizados`, {}, getHeaders());
    return response.data;
};

/**
 * @param {string} pacienteId
 * @returns {Promise<Array>}
 */
export const getHistorialPaciente = async (pacienteId) => {
    const response = await axios.get(
        `${API_BASE}/medicos/pacientes/${pacienteId}/historial`,
        getHeaders()
    );
    return response.data;
};