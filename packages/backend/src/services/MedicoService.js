import MedicoRepository from "../domain/models/repositories/MedicoRepository.js";
import AppError from "../shared/errors/AppError.js";
import Medico from '../domain/models/entities/medico/Medico.js';
export default class MedicoService {
    constructor({ medicoRepository = new MedicoRepository() } = {}) {
        this.medicoRepository = medicoRepository;
    }

    toDTO(medico) {
        return {
            id: medico.id || medico._id,
            usuario: medico.usiario,
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
        const { usuario, matricula, nombre } = data;

        if (!usuario || !matricula || !nombre) {
            //error  de faltan campos obligatorias para registrar al medico :c
        }

        const nuevoMedico = new Medico(usuario, matricula, nombre);
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
}