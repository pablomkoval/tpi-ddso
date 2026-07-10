import { MedicoModel } from "../../../schemas/medico.schema.js";


export class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }

    async save(medico) {
        const nuevoMedico = new this.model(medico);
        return await nuevoMedico.save();
    }

    async findAll() {
        return await this.model.find().populate('especialidades practicas sedes');
    }
    async findAllConTurnos() {
        return await this.model.find().populate(['especialidades', 'practicas', 'sedes', 'turnos']);
    }

    async findById(id) {
    return await this.model
        .findById(id)
        .populate({
            path: 'especialidades',
            populate: {
                path: 'servicioUnico'
            }
        })
        .populate({
            path: 'practicas',
            populate: {
                path: 'servicioUnico'
            }
        })
        .populate('sedes');
}

    async findByIdUsuario(idUsuario) {
        return await this.model
            .findOne({ usuario: idUsuario })
            .populate({
                path: 'especialidades',
                populate: {
                    path: 'servicioUnico'
                }
            })
            .populate({
                path: 'practicas',
                populate: {
                    path: 'servicioUnico'
                }
            })
            .populate('sedes');
    }

    async findByUsername(username) {
        // Busca un médico cuyo campo 'usuario' coincida con el username de Keycloak
        // (útil para médicos creados manualmente vía Keycloak sin usar el endpoint de registro)
        return await this.model
            .findOne({ usuario: { $regex: username, $options: 'i' } })
            .populate({
                path: 'especialidades',
                populate: { path: 'servicioUnico' }
            })
            .populate({
                path: 'practicas',
                populate: { path: 'servicioUnico' }
            })
            .populate('sedes');
    }

    async guardar(medico) {
        return await medico.save(/* { session } */)
    }

    async update(idMedico, data) {
        return await MedicoModel.findByIdAndUpdate(
            idMedico,
            { $set: data },
            {
                new: true,
                runValidators: true
            }
        );
    }

    /* async findDisponibilidadesById(id) {
        try {
            const medico = await this.model.findById(id)
                .populate('disponibilidades')
                .populate('especialidades')
                .populate('practicas')
                .populate('sedes');

            if (!medico) {
                throw new Error('Médico no encontrado');
            }
            return medico.disponibilidades;
        } catch (error) {
            throw new Error(`Error al obtener disponibilidades: ${error.message}`, { cause: error });
        }
    } */

    /*  async findByServicio(especialidadId) {
             return await MedicoModel.find({
                 activo: true,
                 especialidades: especialidadId
             })
                 .populate('especialidades', 'nombre')
                 .lean();
         } */
}