import axios from 'axios';

const API_URL = 'http://localhost:4000/turnos/disponibles'; 

export const buscarTurnos = async (filtros) => {
    try{
        const token = localStorage.getItem("token");

        const queryParams = {
            servicioId: filtros.especialidad || undefined, // *Obligatorio
            sedeId: filtros.sede || undefined,
            medicoId: filtros.profesional || undefined,
            fechaDesde: filtros.fechaDesde || undefined,
            fechaHasta: filtros.fechaHasta || undefined,
            sortBy: filtros.sortBy || undefined,
            sortOrder: filtros.sortOrder || undefined
        };
        const response = await axios.get(API_URL, {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });

        return response.data.data.turnos;
    } catch (error) {
        console.error("Error al conectar con la API de turnos:", error);
        throw error;
    }
    
};

/*
queryparams aceptados:
medicoId
sedeId
servicioId *obligatorio
fechaDesde
fechaHasta
sortBy: ["fechaHora", "costo"]
sortOrder: [1, -1]
*/