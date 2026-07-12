import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
const API_URL_ESP = `${API_BASE}/servicios`; 
const API_URL_SEDE = `${API_BASE}/sedes`; 
const API_URL_MED = `${API_BASE}/medicos`; 

export const buscarServicios = async () => {
    try{
        const response = await axios.get(API_URL_ESP);

        const servicios = response.data.data.map(servicio => ({
            nombre: servicio.nombre,
            id: servicio.id,
        }));

        return servicios;
    } catch (error) {
        console.error("Error al conectar con la API de servicios:", error);
        throw error;
    }
};

export const buscarEspecialidades = buscarServicios;

export const buscarSedes = async () => {
    try{
        const response = await axios.get(API_URL_SEDE);

        const sedes = response.data.data.map(sede => ({
            nombre: sede.nombre,
            id: sede._id,
        }));

        return sedes;
    } catch (error) {
        console.error("Error al conectar con la API de sedes:", error);
        throw error;
    }
};

export const buscarMedicos = async (servicioId = '') => {
    try{
        const url = servicioId ? `${API_URL_MED}?servicioId=${servicioId}` : API_URL_MED;
        const response = await axios.get(url);

        const datosMedicos = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
        const medicos = datosMedicos.map(medico => ({
            nombre: medico.nombre,
            id: medico.id ?? medico._id,
        }));
        
        return medicos;
    } catch (error) {
        console.error("Error al conectar con la API de medicos:", error);
        throw error;
    }
};