import express from "express";

export class MedicoRouter {
    constructor(controller) {
        this.controller = controller;
        this.medicoRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        this.medicoRouter.get("/", (req, res, next) => { this.controller.findAll(req, res, next); }); // findAllPaginated
        this.medicoRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });

        this.medicoRouter.get("/:idMedico", (req, res, next) => { this.controller.findById(req, res, next); });
        //método patch si hacemos disponibilidades sin path

        this.medicoRouter.get("/:idMedico/disponibilidades", (req, res, next) => { this.controller.obtenerDisponibilidades(req, res, next); });
        this.medicoRouter.post("/:idMedico/disponibilidades", (req, res, next) => { this.controller.agregarDisponibilidades(req, res, next); });

        this.medicoRouter.patch("/:idMedico/disponibilidades/:disponibilidadId", (req, res, next) => { this.controller.editarDisponibilidad(req, res, next); });
        this.medicoRouter.delete("/:idMedico/disponibilidades/:disponibilidadId", (req, res, next) => { this.controller.eliminarDisponibilidad(req, res, next); });

        this.medicoRouter.get("/:idMedico/servicios", (req, res, next) => { this.controller.obtenerServicioMeds(req, res, next); });
        this.medicoRouter.post("/:idMedico/servicios", (req, res, next) => { this.controller.altaServicioMed(req, res, next); });

        this.medicoRouter.get("/:idMedico/servicios/:idServicioMed", (req, res, next) => { this.controller.obtenerServicioMedPorId(req, res, next); });
        this.medicoRouter.patch("/:idMedico/servicios/:idServicioMed", (req, res, next) => { this.controller.editarServicioMed(req, res, next); });
        this.medicoRouter.delete("/:idMedico/servicios/:idServicioMed", (req, res, next) => { this.controller.bajaServicioMed(req, res, next); });

    }

    getRouter() {
        return this.medicoRouter;
    }
}

//import MedicoController from "../../controllers/medico.controller.js";

/* const medicoRouter = express.Router();
const medicoController = new MedicoController();

medicoRouter.route('/')
    .get((req, res, next) => medicoController.findAll(req, res, next))
    .post((req, res, next) => medicoController.create(req, res, next))

medicoRouter.route('/:idMedico')
    .get((req, res, next) => medicoController.findById(req, res, next))
    //patch((req,res,next)) => medicoController.updateMedico(req, res, next))

medicoRouter.route('/:idMedico/disponibilidades')
    .get((req, res, next) => medicoController.obtenerDisponibilidades(req, res, next))
    .post((req, res, next) => medicoController.agregarDisponibilidades(req, res, next))

medicoRouter.route("/:idMedico/disponibilidades/:disponibilidadId")
    .patch((req, res, next) => medicoController.editarDisponibilidad(req, res, next))
    .delete((req, res, next) => medicoController.eliminarDisponibilidad(req, res, next))

medicoRouter.route('/:idMedico/servicios')
    .get((req, res, next) => medicoController.obtenerServicioMeds(req, res, next))
    .post((req, res, next) => medicoController.altaServicioMed(req, res, next))

medicoRouter.route('/:idMedico/servicios/:idServicioMed')
    .get((req, res, next) => medicoController.obtenerServicioMedPorId(req, res, next))
    .patch((req, res, next) => medicoController.editarServicioMed(req, res, next))
    .delete((req, res, next) => medicoController.bajaServicioMed(req, res, next))

export default medicoRouter; */

