import { ObraSocialModel } from '../../../schemas/obraSocial.schema.js';
import { PlanModel } from '../../../schemas/plan.schema.js';

export class ObraSocialRepository {
    constructor() {
        this.models = {
            obraSocial: ObraSocialModel,
            plan: PlanModel,
        }
    }

    async findAll() {
        return await this.models["obraSocial"].find({}).populate('planes');
    }

    async findById(id) {
        return await this.models["obraSocial"].findById(id).populate('planes');
    }

    async findByName(nombre) {
        return await this.models["obraSocial"].findOne({ nombre });
    }

    async create(datosObraSocial) {
        return await this.models["obraSocial"].create(datosObraSocial)
    }
    async save(datosObraSocial) {
        return await this.models["obraSocial"].save(datosObraSocial)
    }

    async update(id, obraSocialModificada) {
        return await this.models["obraSocial"].findByIdAndUpdate(id, obraSocialModificada, { new: true }).populate('planes');
    }

    async delete(id) {
        return await this.models["obraSocial"].findByIdAndDelete(id)
    }

    ////////////////////// PLANES ////////////////////////



    async findAllPlanes() {
        return await this.models["plan"].find({});
    }

    async findPlanById(id) {
        return await this.models["plan"].findById(id);
    }

    async findPlanByName(nombre) {
        return await this.models["plan"].findOne({ nombre });
    }

    async createPlan(datosPlan) {
        return await this.models["plan"].create(datosPlan)
    }

    async savePlan(datosPlan) {
        return await this.models["plan"].save(datosPlan)
    }

    async updatePlan(id, planModificado) {
        return await this.models["plan"].findByIdAndUpdate(id, planModificado, { new: true });
    }

    async deletePlan(id) {
        return await this.models["plan"].findByIdAndDelete(id)
    }





}