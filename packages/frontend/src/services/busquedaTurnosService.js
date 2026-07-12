import axios from 'axios';

const API_URL = 'http://localhost:4000/turnos/disponibles'; 

export const buscarTurnos = async (filtros, pagina = 1, limite = 10) => {
    try{
        const token = localStorage.getItem("token");

        const queryParams = {
            servicioId: filtros.servicio || undefined, // *Obligatorio
            sedeId: filtros.sede || undefined,
            medicoId: filtros.profesional || undefined,
            fechaDesde: filtros.fechaDesde || undefined,
            fechaHasta: filtros.fechaHasta || undefined,
            sortBy: filtros.sortBy || undefined,
            sortOrder: filtros.sortOrder || undefined,
            page: filtros.page || pagina,
            limit: filtros.limit || limite
        };
        const response = await axios.get(API_URL, {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.data;
    } catch (error) {
        console.error("Error al conectar con la API de turnos:", error);
        throw error;
    }

};

export const obtenerTurnoPorId = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4000/turnos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener el turno por ID:", error);
        throw error;
    }
}

export const obtenerTurnosPorPaciente = async (pacienteId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4000/turnos?pacienteId=${pacienteId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener los turnos por paciente:", error);
        throw error;
    }
}
