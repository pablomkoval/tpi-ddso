import MedicoModel from '../persistence/schemas/MedicoSchema.js';

class MedicoRepository {

    async findAll() {
        return await MedicoModel.find({ activo: true })
            .populate('especialidades', 'nombre')
            .populate('practicas', 'nombre')
            .populate('sedes', 'nombre direccion')
            .lean();
    }

    async findById(id) {
        return await MedicoModel.findById(id)
            .populate('especialidades', 'nombre')
            .populate('practicas', 'nombre')
            .populate('sedes', 'nombre direccion')
            .lean();
    }

    async findByEspecialidad(especialidadId) {
        return await MedicoModel.find({
            activo: true,
            especialidades: especialidadId
        })
            .populate('especialidades', 'nombre')
            .lean();
    }

    async create(data) {
        const medico = new MedicoModel(data);
        return await medico.save();
    }

    async update(id, data) {
        return await MedicoModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }
}

export default new MedicoRepository();
