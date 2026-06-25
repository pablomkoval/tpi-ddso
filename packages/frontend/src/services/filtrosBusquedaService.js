import axios from 'axios';

const API_URL_ESP = 'http://localhost:4000/servicios'; 

const API_URL_SEDE = 'http://localhost:4000/sedes'; 

const API_URL_MED = 'http://localhost:4000/medicos'; 

export const buscarEspecialidades = async () => {
    try{
        const response = await axios.get(API_URL_ESP);

        const especialidades = response.data.data.map(especialidad => ({
            nombre: especialidad.nombre,
            id: especialidad.id,
        }));

        return especialidades;
    } catch (error) {
        console.error("Error al conectar con la API de servicios:", error);
        throw error;
    }
};

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

export const buscarMedicos = async () => {
    try{
        const response = await axios.get(API_URL_MED);
        
        const medicos = response.data.map(medico => ({
            nombre: medico.nombre,
            id: medico.id,
        }));
        
        return medicos;
    } catch (error) {
        console.error("Error al conectar con la API de medicos:", error);
        throw error;
    }
};