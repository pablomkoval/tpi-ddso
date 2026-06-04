import express from "express";


export class ServicioRouter {
    constructor(controller) {
        this.controller = controller;
        this.servicioRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        /**
         * @swagger
         * /servicios:
         *  get:
         *      summary: Obtener el catálogo completo de servicios médicos
         *      tags: [Catálogo Servicios]
         *      responses:
         *          200:
         *              description: Catálogo de servicios obtenido correctamente
         *  post:
         *      summary: Crear un nuevo servicio médico en el catálogo
         *      tags: [Catálogo Servicios]
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *          schema:
         *              type: object
         *              properties:
         *                  nombre:
         *                      type: string
         *                      example: 'Pediatría General'
         *                  tipoServicio:
         *                      type: string
         *                      enum: [especialidad, practica]
         *                      example: 'especialidad'
         *      responses:
         *          201:
         *              description: Servicio creado con éxito en el catálogo general
         */
        this.servicioRouter.get("/", (req, res, next) => { this.controller.findAll(req, res, next); });
        this.servicioRouter.post("/", (req, res, next) => { this.controller.create(req, res, next); });

        /**
         * @swagger
         * /servicios/{id}:
         *  get:
         *      summary: Obtener un servicio médico específico del catálogo
         *      tags: [Catálogo Servicios]
         *      parameters:
         *        - name: id
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *              description: ID del servicio en MongoDB
         *      responses:
         *          200:
         *              description: Servicio encontrado y retornado de forma correcta
         *  put:
         *      summary: Actualizar por completo un servicio médico existente
         *      tags: [Catálogo Servicios]
         *      parameters:
         *        - name: id
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *              description: ID del servicio en MongoDB
         *      requestBody:
         *          required: true
         *          content:
         *              application/json:
         *          schema:
         *              type: object
         *              properties:
         *                  nombre:
         *                      type: string
         *                      example: 'Pediatría Avanzada'
         *                  tipoServicio:
         *                      type: string
         *                      example: 'especialidad'
         *      responses:
         *          200:
         *              description: Servicio médico actualizado exitosamente
         *  delete:
         *      summary: Eliminar un servicio médico del catálogo general (Borrado lógico)
         *      tags: [Catálogo Servicios]
         *      parameters:
         *        - name: id
         *          in: path
         *          required: true
         *          schema:
         *              type: string
         *              description: ID del servicio en MongoDB
         *      responses:
         *          200:
         *              description: Servicio médico removido del catálogo de forma correcta
         */
        this.servicioRouter.get("/:id", (req, res, next) => { this.controller.findById(req, res, next); });
        this.servicioRouter.put("/:id", (req, res, next) => { this.controller.update(req, res, next); });
        this.servicioRouter.delete("/:id", (req, res, next) => { this.controller.delete(req, res, next); });

    }

    getRouter() {
        return this.servicioRouter;
    }
}

/* import { ServiciosController } from "../../controllers/servicios.controller.js";

const servicioController = new ServiciosController

const serviciosRouter = express.Router();

serviciosRouter.route('/')
    .get((req, res, next) => servicioController.findAll(req, res, next))
    .post((req, res, next) => servicioController.create(req, res, next))


serviciosRouter.route('/:id')
    .get((req, res, next) => servicioController.findById(req, res, next))
    .put((req, res, next) => servicioController.update(req, res, next))
    .delete((req, res, next) => servicioController.delete(req, res, next))


export default serviciosRouter; */