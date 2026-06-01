import express from "express";
import { ServiciosController } from "../../controllers/servicios.controller.js";

const servicioController = new ServiciosController

const serviciosRouter = express.Router();

serviciosRouter.route('/')
    .get((req, res, next) => servicioController.findAll(req, res, next))
    .post((req, res, next) => servicioController.create(req, res, next))


serviciosRouter.route('/:id')
    .get((req, res, next) => servicioController.findById(req, res, next))
    .put((req, res, next) => servicioController.update(req, res, next))
    .delete((req, res, next) => servicioController.delete(req, res, next))

/* serviciosRouter.route('/categorias')
    .get((req, res, next) => servicioController.seed(req, res, next))
 */
export default serviciosRouter;
