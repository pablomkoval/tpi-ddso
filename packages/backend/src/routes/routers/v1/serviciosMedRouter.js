import express from "express";
import { ServiciosMedController } from "../../../controllers/serviciosMedController";


const servicioMedController = new ServiciosMedController

const servicioMedsRouter = express.Router();


servicioMedsRouter.route('/')
    .get((req, res, next) => servicioMedController.findAll(req, res, next))
    .post((req, res, next) => servicioMedController.create(req, res, next))

servicioMedsRouter.route('/seed')
    .post((req, res, next) => servicioMedController.seed(req, res, next))

servicioMedsRouter.route('/:id')
    .get((req, res, next) => servicioMedController.findById(req, res, next))
    .put((req, res, next) => servicioMedController.update(req, res, next))
    .delete((req, res, next) => servicioMedController.delete(req, res, next))

export default servicioMedsRouter;
