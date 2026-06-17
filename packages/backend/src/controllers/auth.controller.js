import { registerSchema } from "../validators/auth.schema.zod.js";

export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async register(req, res, next) {
        try {

            // valida el body acá
            const validatedData = registerSchema.parse(req.body);

            // llama al service
            await this.authService.register(validatedData);

            res.status(201).json({
                mensaje: "Usuario registrado correctamente"
            });

        } catch (error) {
            console.error("ERROR REGISTER", error);
            next(error);
        }
    }
}