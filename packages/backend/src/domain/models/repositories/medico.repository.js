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
        return await this.model.find().populate('especialidades').populate('practicas').populate('sedes');
    }

    async findById(id) { // implementar session despues
        const medico = await this.model.findById(id)
        if (!medico) {
            return null // lanzar error?
        }
        await medico.populate('especialidades');
        await medico.populate('practicas');
        await medico.populate('sedes')
        return medico;
    }

    async guardar(medico) {
        return await medico.save(/* { session } */)
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