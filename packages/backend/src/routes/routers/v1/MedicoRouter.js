import express from "express";
import MedicoController from "../../../controllers/medicos/MedicoController.js";

const medicoRouter = express.Router();
const medicoController = new MedicoController();

medicoRouter.route('/')
    .get((req, res, next) => medicoController.findAll(req, res, next))
    .post((req, res, next) => medicoController.create(req, res, next))

medicoRouter.route('/:idMedico')
    .get((req, res, next) => medicoController.findById(req, res, next))

medicoRouter.route('/:idMedico/disponibilidad')
    .get((req, res, next) => medicoController.obtenerDisponibilidades(req, res, next))
    .post((req, res, next) => medicoController.agregarDisponibilidades(req, res, next))


medicoRouter.route("/:idMedico/disponibilidad/:disponibilidadId")
    .patch((req, res, next) => medicoController.editarDisponibilidad(req, res, next))
    .delete((req, res, next) => medicoController.eliminarDisponibilidad(req, res, next))

medicoRouter.route('/:idMedico/servicios')
    .get((req, res, next) => medicoController.obtenerServicioMeds(req, res, next))
    .post((req, res, next) => medicoController.altaServicioMed(req, res, next))

medicoRouter.route('/:idMedico/servicios/:idServicio')
    .get((req, res, next) => medicoController.obtenerServicioMedPorId(req, res, next))
    .patch((req, res, next) => medicoController.editarServicioMed(req, res, next))
    .delete((req, res, next) => medicoController.bajaServicioMed(req, res, next))


export default medicoRouter;