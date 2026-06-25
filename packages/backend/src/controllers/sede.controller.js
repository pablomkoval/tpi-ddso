export class SedeController {
    constructor(sedeService) {
        this.sedeService = sedeService;
    }

    findAll = async (req, res, next) => {
        try {
            const sedes = await this.sedeService.findAll();
            res.json({
                status: "success",
                data: sedes
            });
        } catch (error) {
            next(error);
        }
    }

    create = async (req, res, next) => {
        try {
            const nuevaSede = await this.sedeService.create(req.body);
            res.status(201).json(nuevaSede);
        } catch (error) {
            next(error);
        }
    }

    findById = async (req, res, next) => {
        try {
            const sede = await this.sedeService.findById(req.params.id);
            if (!sede) {
                return res.status(404).json({ message: 'Sede no encontrada' });
            }
        } catch (error) {
            next(error);
        }
    }
}

