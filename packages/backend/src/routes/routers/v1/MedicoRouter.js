import express from "express";
import MedicoController from "../../../controllers/medicos/MedicoController.js";

const router = express.Router();
const medicoController = new MedicoController();

router.route('/')
    .get((req, res, next) => medicoController.findAll(req, res, next))

router.route('/')
    .post((req, res, next) => medicoController.create(req, res, next))

router.route('/:id')
    .get((req, res, next) => medicoController.findById(req, res, next))

router.route('/:id/disponibilidad')
    .get((req, res, next) => medicoController.obtenerDisponibilidades(req, res, next))
    .post((req, res, next) => medicoController.agregarDisponibilidades(req, res, next))

router.route("/:id/disponibilidad/:disponibilidadId")
    .patch((req, res, next) => medicoController.editarDisponibilidad(req, res, next))
    .delete((req, res, next) => medicoController.eliminarDisponibilidad(req, res, next))

export default router;