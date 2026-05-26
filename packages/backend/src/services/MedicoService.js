import MedicoRepository from "../domain/models/repositories/MedicoRepository.js";
import AppError from "../shared/errors/AppError.js";
import Medico from '../domain/models/entities/medico/Medico.js';
import { DisponibilidadHoraria } from "../domain/models/entities/medico/DisponibilidadHoraria.js";
export default class MedicoService {
    constructor({ medicoRepository = new MedicoRepository() } = {}) {
        this.medicoRepository = medicoRepository;
    }

    toDTO(medico) {
        return {
            id: medico.id || medico._id,
            usuario: medico.usuario,
            matricula: medico.matricula,
            nombre: medico.nombre,
            especialidades: medico.especialidades,
            practicas: medico.practicas,
            sedes: medico.sedes,
            disponibilidades: medico.disponibilidades,
            turnos: medico.turnos
        };
    }

    async create(data) {
        const { usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidades } = data;
        const disponibilidadesInstanciadas = disponibilidades.map(d => new DisponibilidadHoraria(d.diaSemana, d.horaDesde, d.horaHasta, d.sede));

        const nuevoMedico = new Medico(usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidadesInstanciadas);
        const medicoGuardado = await this.medicoRepository.save(nuevoMedico);
        return this.toDTO(medicoGuardado);
    }

    async update (id, data) {
        const medicoExistente = await this.medicoRepository.findById(id);
        
        if(!medicoExistente) {
            // error de q no se encontro el medico
        }

        const actualizado = await this.medicoRepository.update(id, data);
        return this.toDTO(actualizado);
    }

    async findAll() {
        const medicos = await this.medicoRepository.findAll();
        return medicos.map( medico => this.toDTO(medico));
    }

    async findById(id) {
        const medico = await this.medicoRepository.findById(id);
        
        if (!medico) {
            //dsp fijarse errores con el error handler
            throw new AppError("Medico de Id ${id} no encontrado", 404, "MEDICO_NO_ENCONTRADO");
        }

        return this.toDTO(medico);
    }

    async obtenerDisponibilidades(id) {
        try {
            const medico = await this.medicoRepository.model.findById(id);
            if (!medico) {
                throw new Error('Médico no encontrado');
            }
            return medico.disponibilidades;
        } catch (error) {
            throw new Error(`Error al obtener disponibilidades: ${error.message}`, { cause: error });
        } 
    }

    async agregarDisponibilidades(id, nuevasDisponibilidades) {
        try {
            const medico = await this.medicoRepository.model.findById(id);
            if (!medico) {
                throw new Error('Médico no encontrado');
            }

            const nuevasDisponibilidadesInstanciadas = nuevasDisponibilidades.map(d => new DisponibilidadHoraria(d.diaSemana, d.horaDesde, d.horaHasta, d.sede));
            medico.agregarDisponibilidades(nuevasDisponibilidadesInstanciadas);

            const medicoActualizado = await medico.save();
            return this.toDTO(medicoActualizado);
        } catch (error) {
            throw new Error(`Error al agregar disponibilidades: ${error.message}`, { cause: error });
        }
    }
}