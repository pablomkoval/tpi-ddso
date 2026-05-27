import express from "express";
import { ServiciosController } from "../../../controllers/serviciosController";


const servicioController = new ServiciosController

const servicioRouter = express.Router();


servicioRouter.route('/')
    .get((req, res, next) => servicioController.findAll(req, res, next))
    .post((req, res, next) => servicioController.create(req, res, next))

servicioRouter.route('/seed')
    .post((req, res, next) => servicioController.seed(req, res, next))

servicioRouter.route('/:id')
    .get((req, res, next) => servicioController.findById(req, res, next))
    .put((req, res, next) => servicioController.update(req, res, next))
    .delete((req, res, next) => servicioController.delete(req, res, next))

servicioRouter.route('/categorias')
    .get((req, res, next) => servicioController.seed(req, res, next))

export default servicioRouter;
