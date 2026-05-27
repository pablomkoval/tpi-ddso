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

router.route('/:idMedico/disponibilidad')
    .get((req, res, next) => medicoController.obtenerDisponibilidades(req, res, next))
    .post((req, res, next) => medicoController.agregarDisponibilidades(req, res, next))

/* router.route('/:idMedico/servicios')
    .get((req, res, next) => medicoController.obtenerServicioMeds(req, res, next))
    .post((req, res, next) => medicoController.altaServicioMed(req, res, next))

router.route('/:idMedico/servicios/:idServicio')
    .get((req, res, next) => medicoController.obtenerServicioMedPorId(req, res, next)) */
	/* .put((req, res, next) => medicoController.actualizarServicioMed(req, res, next))  */ /* esto implica que un medico pueda cambiar el costo de servicios que dan otros medicos */
	/* .delete((req, res, next) => medicoController.bajaServicioMed(req, res, next))
 */

export default router;