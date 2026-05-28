import MedicoRepository from "../domain/models/repositories/MedicoRepository.js";
import AppError from "../shared/errors/AppError.js";
import Medico from '../domain/models/entities/medico/Medico.js';
import { DisponibilidadHoraria } from "../domain/models/entities/medico/DisponibilidadHoraria.js";
import { NotFoundError } from "../shared/errors/AppError.js"; // Ajustá los ../ según tu carpeta
import UsuarioRepository from "../domain/models/repositories/UsuarioRepository.js";

export default class MedicoService {
    constructor({ medicoRepository = new MedicoRepository() } = {}, { usuarioRepository = new UsuarioRepository() }) {
        this.medicoRepository = medicoRepository;
        this.usuarioRepository = usuarioRepository;
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
        const { usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidades = []} = data;

        const usuarioEncontrado = await this.usuarioRepository.findOne(usuario);
        if (!usuarioEncontrado) {
            throw new AppError("El usuario de login no existe", 404, "USUARIO_NO_ENCONTRADO");
        }
        
        const disponibilidadesInstanciadas = disponibilidades.map(d => new DisponibilidadHoraria(
            {
                diaSemana: d.diaSemana,
                horaDesde: d.horaDesde,
                horaHasta: d.horaHasta,
                sede: d.sede
            }
        ));

        const nuevoMedico = new Medico(usuario, matricula, nombre, especialidades, practicas, sedes, disponibilidadesInstanciadas);
        const medicoGuardado = await this.medicoRepository.save(nuevoMedico);
        return this.toDTO(medicoGuardado);
    }

    async update(id, data) {
        const medicoExistente = await this.medicoRepository.findById(id);

        if (!medicoExistente) {
            throw new NotFoundError("No se puede actualizar, médico con Id " + id + " no encontrado", "MEDICO_UPDATE_FAIL");
        }

        const actualizado = await this.medicoRepository.update(id, data);
        return this.toDTO(actualizado);
    }

    async findAll() {
        const medicos = await this.medicoRepository.findAll();
        return medicos.map(medico => this.toDTO(medico));
    }

    async findById(id) {
        const medico = await this.medicoRepository.findById(id);

        if (!medico) {
            throw new NotFoundError("Médico con Id " + id + " no encontrado", "MEDICO_NO_ENCONTRADO");
        }

        return this.toDTO(medico);
    }

    async obtenerDisponibilidades(id) {
        try {
            const medico = await this.medicoRepository.findById(id);
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

            const nuevasDisponibilidadesInstanciadas = nuevasDisponibilidades.map(d => new DisponibilidadHoraria(
                {
                    diaSemana: d.diaSemana,
                    horaDesde: d.horaDesde,
                    horaHasta: d.horaHasta,
                    sede: d.sede
                }
            ));
            medico.agregarDisponibilidades(nuevasDisponibilidadesInstanciadas);

            const medicoActualizado = await medico.save();
            return this.toDTO(medicoActualizado);
        } catch (error) {
            throw new Error(`Error al agregar disponibilidades: ${error.message}`, { cause: error });
        }
    }

    async editarDisponibilidad(id, disponibilidadId, cambios) {
        const medico = await this.medicoRepository.model.findById(id);
        if (!medico) throw new AppError("Médico no encontrado", 404, "MEDICO_NO_ENCONTRADO");

        medico.editarDisponibilidad(disponibilidadId, cambios);

        await medico.save();

        return this.toDTO(medico);
    }

    async eliminarDisponibilidad(id, disponibilidadId) {
        const medico = await this.medicoRepository.model.findById(id);
        if (!medico) throw new AppError("Médico no encontrado", 404, "MEDICO_NO_ENCONTRADO");

        medico.disponibilidades = medico.disponibilidades.filter(
            d => String(d._id) !== String(disponibilidadId)
        );

        await medico.save();
        return this.toDTO(medico);
    }

}