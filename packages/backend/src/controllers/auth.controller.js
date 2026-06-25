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
            if (error.status === 409) {
                return res.status(409).json({ message: error.message });
            }

            if (error.name === 'ZodError') {
                return res.status(400).json({ message: "Datos inválidos", details: error.errors });
            }
            console.error("ERROR REGISTER", error);
            next(error);
        }
    }
}