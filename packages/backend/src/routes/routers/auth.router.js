import express from "express";

export class AuthRouter {
    constructor(controller) {
        this.controller = controller;
        this.authRouter = express.Router();
        this.initRoutes();
    }

    initRoutes() {

        /**
         * @swagger
         * /auth/register:
         *   post:
         *     summary: Registra un nuevo usuario en el sistema
         *     tags: [Auth]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               role:
         *                 type: string
         *                 example: paciente
         *               username:
         *                 type: string
         *                 example: pablo123
         *               password:
         *                 type: string
         *                 example: password123
         *               nombre:
         *                 type: string
         *                 example: Pablo
         *               dni:
         *                 type: string
         *                 example: 44322111
         *               obraSocial:
         *                 type: string
         *                 example: OSDE
         *               plan:
         *                 type: string
         *                 example: 210
         *               matricula:
         *                 type: string
         *                 example: MED123
         *     responses:
         *       201:
         *         description: Usuario registrado correctamente
         *       400:
         *         description: Datos inválidos
         */
        this.authRouter.post("/register", (req, res, next) => {
            this.controller.register(req, res, next);
        });
    }

    getRouter() {
        return this.authRouter;
    }
}