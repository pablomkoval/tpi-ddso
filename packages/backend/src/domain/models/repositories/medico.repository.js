import { MedicoModel } from "../../../schemas/medico.schema.js";

export default class MedicoRepository {
    constructor() {
        this.model = MedicoModel;
    }

    async save(medico) {
        const nuevoMedico = new this.model(medico);
        return await nuevoMedico.save();
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id, session = null) { // implementar session despues
        console.error("voy a hacer findbyid y populate")
        /* const query = await this.model.findById(id)
            .populate('especialidades')
            .populate('practicas'); */
        const medico = await this.model.findById(id);
        if(!medico){
            console.error("ningun medico encontrado")
            return null
        }
        console.error("voy a  populate")

        await medico.populate('especialidades');
        await medico.populate('practicas');


        console.error("sobrevivi populate")

        return medico;
    }

    async guardar(medico, session = null) {
        return await medico.save({ session })
    }

    async findDisponibilidadesById(id) {
        try {
            const medico = await this.model.findById(id)
                .populate('disponibilidades')
                .populate('especialidades')
                .populate('practicas');

            if (!medico) {
                throw new Error('Médico no encontrado');
            }
            return medico.disponibilidades;
        } catch (error) {
            throw new Error(`Error al obtener disponibilidades: ${error.message}`, { cause: error });
        }
    }

   /*  async findByServicio(especialidadId) {
            return await MedicoModel.find({
                activo: true,
                especialidades: especialidadId
            })
                .populate('especialidades', 'nombre')
                .lean();
        } */


}