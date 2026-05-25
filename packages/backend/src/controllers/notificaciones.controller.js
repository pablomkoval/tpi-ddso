import { NotificacionesService } from "../services/notificaciones.service.js";
export class NotificacionesController {
    // constructor(notificacionesService) {
    //     this.notificacionesService = notificacionesService;
    // }

    constructor() {
        this.notificacionesService = new NotificacionesService();
    }
    
    async findAll(req, res, next) {
        try {
            const notificaciones = await this.notificacionesService.findAll();
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    async obtenerLeidas(req, res, next) {
        try {
            const notificaciones = await this.notificacionesService.obtenerLeidas();
            res.json(notificaciones);
        } catch (error) {
            next(error);
        }
    }

    async obtenerNoLeidas(req, res, next) {
        try {
            const notificaciones = await this.notificacionesService.obtenerNoLeidas();
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

    // async update(req, res, next) {
    //     try {
    //         const notificacion = await this.notificacionesService.update(req.params.id, req.body);
            
    //         res.json(notificacion);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async marcarComoLeida(req, res, next) {
        try {
            const notificacion = await this.notificacionesService.marcarComoLeida(req.params.id);

            res.json(notificacion);
        } catch (error) {
            next(error);
        }
    }
}