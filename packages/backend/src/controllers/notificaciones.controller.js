
export class NotificacionesController {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }
    
    async findAll(req, res, next) {
        try {
            const notificaciones = await this.notificacionesService.findAll();
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const notificacion = await this.notificacionesService.create(req.body);
            res.status(201).json(notificacion);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const notificacion = await this.notificacionesService.findById(req.params.id);
            res.json(notificacion);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const notificacion = await this.notificacionesService.update(req.params.id, req.body);
            
            res.json(notificacion);
        } catch (error) {
            next(error);
        }
    }
}