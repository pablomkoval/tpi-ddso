import { obraSocialSchema, createPlanSchema } from "../validators/obraSocial.schema.zod.js"
import { parsearId } from "../utils/parsearId.js";

export class ObraSocialController {
    constructor(obraSocialService) {
        this.obraSocialService = obraSocialService;
    }

    create = async (req, res, next) => {
        try {
            const datosObraSocial = obraSocialSchema.safeParse(req.body)

            const nuevaObraSocial = await this.obraSocialService.create(datosObraSocial)
            return res.status(201).json({ status: "success", data: this.obraSocialToDTO(nuevaObraSocial) })
        } catch (error) {
            return next(error)
        }
    }

    findById = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            const obraSocial = await this.obraSocialService.findById(id)

            return res.status(200).json({ status: "success", data: this.obraSocialToDTO(obraSocial) })
        } catch (error) {
            return next(error)
        }
    }

    update = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            const dataObraSocial = obraSocialSchema.safeParse(req.body);
            const obraSocialActualizada = await this.obraSocialService.update(id, dataObraSocial)

            return res.status(200).json({ status: "success", data: this.obraSocialToDTO(obraSocialActualizada) })
        } catch (error) {
            return next(error)
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            await this.obraSocialService.delete(id)

            return res.status(200).json({ status: "success" })
        } catch (error) {
            return next(error)
        }
    }


    async obtenerTodas(req, res, next) {
        try {
            const obrasSociales = await this.obraSocialService.obtenerTodas();

            res.status(200).json(obrasSociales);

        } catch (error) {
            console.error("ERROR OBTENIENDO OBRAS SOCIALES", error);
            next(error);
        }
    }

    createPlan = async (req, res, next) => {
        try {
            const obraSocialId = parsearId(req.params.id)
            const datosPlan = createPlanSchema.safeParse(req.body)
            const nuevoPlan = await this.obraSocialService.createPlan(obraSocialId, datosPlan)
            return res.status(201).json({ status: "success", data: this.planToDTO(nuevoPlan) })
        } catch (error) {
            return next(error)
        }
    }



    updatePlan = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            const dataObraSocial = obraSocialSchema.safeParse(req.body);
            const obraSocialActualizada = await this.obraSocialService.update(id, dataObraSocial)

            return res.status(200).json({ status: "success", data: this.planToDTO(obraSocialActualizada) })
        } catch (error) {
            return next(error)
        }
    }

    deletePlan = async (req, res, next) => {
        try {
            const id = parsearId(req.params.id)
            await this.obraSocialService.delete(id)

            return res.status(200).json({ status: "success" })
        } catch (error) {
            return next(error)
        }
    }

    obraSocialToDTO(obraSocialData){
        console.error(obraSocialData)
        return {
            nombre: obraSocialData?.nombre,
            planes: obraSocialData?.planes.map(p=> this.planToDTO(p))
        }
    }

    planToDTO(planData){
        return {
            _id: planData?._id,
            nombre: planData?.nombre,
            coberturasEspecialidad: planData?.coberturasEspecialidad,
            coberturasPractica: planData?.coberturasPractica
        }
    }




}