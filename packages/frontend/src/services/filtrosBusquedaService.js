import axios from 'axios';

const API_URL_ESP = 'http://localhost:4000/servicios'; 

const API_URL_SEDE = 'http://localhost:4000/sedes'; 

const API_URL_MED = 'http://localhost:4000/medicos'; 

export const buscarEspecialidades = async () => {
    try{
        const response = await axios.get(API_URL_ESP);

        const especialidad = {
            nombre: response.data.nombre,
            id: response.data.id,
        }
        return especialidad;
    } catch (error) {
        console.error("Error al conectar con la API de servicios:", error);
        throw error;
    }
};

export const buscarSedes = async () => {
    try{
        const response = await axios.get(API_URL_SEDE);

        const sede = {
            nombre: response.data.nombre,
            id: response.data.id,
        }
        return sede;
    } catch (error) {
        console.error("Error al conectar con la API de sedes:", error);
        throw error;
    }
};

export const buscarMedicos = async () => {
    try{
        const response = await axios.get(API_URL_ESP);
        
        const medico = {
            nombre: response.data.nombre,
            id: response.data.id,
        }
        return medico;
    } catch (error) {
        console.error("Error al conectar con la API de medicos:", error);
        throw error;
    }
};