import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000').replace(/\/+$/, '');

const API_BASE = API_BASE_URL;

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

/**
 * Obtiene el perfil del paciente autenticado via token.
 * @returns {Promise<Object>} datos del paciente
 */
export const getMiPaciente = async () => {
    const response = await axios.get(`${API_BASE}/pacientes/me`, getHeaders());
    return response.data;
};

/**
 * Obtiene el historial de turnos del paciente.
 * @param {string} pacienteId
 * @returns {Promise<Array>}
 */
export const getMisTurnos = async (pacienteId) => {
    const response = await axios.get(
        `${API_BASE}/pacientes/${pacienteId}/turnos`,
        getHeaders()
    );
    return response.data;
};

/**
 * Cancela un turno del paciente con motivo. Solo se puede cancelar con al menos 1 hora de anticipación.
 * @param {string} pacienteId
 * @param {string} turnoId
 * @param {string} motivo - Motivo de la cancelación (requerido)
 * @returns {Promise<Object>} turno cancelado
 */
export const cancelarTurno = async (turnoId, motivo) => {
    const response = await axios.patch(
        `${API_BASE}/turnos/${turnoId}`,
        { estado: 'CANCELADO', rol: 'PACIENTE', motivo },
        getHeaders()
    );
    return response.data;
};

/**
 * Reserva un turno disponible para el paciente.
 * @param {string} pacienteId
 * @param {string} turnoId
 * @returns {Promise<Object>} turno reservado
 */
export const reservarTurno = async (turnoId) => {
    const response = await axios.patch(
        `${API_BASE}/turnos/${turnoId}`,
        { estado: 'RESERVADO', rol: 'PACIENTE' },
        getHeaders()
    );
    return response.data;
};

/**
 * Solicita un cambio de fecha de un turno. El nuevo turno debe ser del mismo médico
 * y la misma especialidad/práctica. Ambos turnos pasan a estado RESERVADO hasta
 * que el médico confirme o rechace la solicitud.
 * @param {string} pacienteId
 * @param {string} turnoActualId - ID del turno a cambiar
 * @param {string} nuevoTurnoId - ID del turno disponible al que se quiere cambiar
 * @returns {Promise<Object>} { turnoActual, nuevoTurno, solicitud }
 */
export const solicitarCambioFecha = async (pacienteId, turnoActualId, nuevoTurnoId) => {
    const response = await axios.post(
        `${API_BASE}/pacientes/${pacienteId}/turnos/${turnoActualId}/cambios`,
        { nuevoTurnoId },
        getHeaders()
    );
    return response.data;
};

/**
 * Busca turnos disponibles filtrados por médico y servicio para el cambio de fecha.
 * @param {string} medicoId
 * @param {string} servicioId - ID del servicio base (servicioUnico._id)
 * @returns {Promise<Array>} turnos disponibles
 */
export const buscarTurnosParaCambio = async (medicoId, servicioId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE}/turnos/disponibles`, {
        params: {
            medicoId,
            servicioId,
            limit: 50,
        },
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data?.data?.turnos || [];
};
