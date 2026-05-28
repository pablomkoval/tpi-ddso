/* import EspecialidadModel from '../persistence/schemas/EspecialidadSchema.js';

class EspecialidadRepository {

    async findAll() {
        return await EspecialidadModel.find().lean();
    }

    async findById(id) {
        return await EspecialidadModel.findById(id).lean();
    }

    async create(data) {
        const especialidad = new EspecialidadModel(data);
        return await especialidad.save();
    }

    async update(id, data) {
        return await EspecialidadModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }
}

export default new EspecialidadRepository();
 */