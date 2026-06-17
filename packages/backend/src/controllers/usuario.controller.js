import { UsuarioModel } from '../models/UsuarioModel.js';

export class UsuarioController {
    
    // Este endpoint sería un GET /usuarios/mi-perfil
    async obtenerMiPerfil(req, res, next) {
        try {
            // Gracias al middleware, ya tenemos el ID de Keycloak de la persona que hace la petición
            const keycloakId = req.usuarioKeycloakId;

            // Buscamos en NUESTRA base de datos (MongoDB) al usuario que tenga ese keycloakId
            const usuarioMongo = await UsuarioModel.findOne({ keycloakId: keycloakId });

            if (!usuarioMongo) {
                return res.status(404).json({ mensaje: 'Perfil no encontrado en MongoDB' });
            }

            // Devolvemos el perfil completo de Mongo (nombre, dni, obra social, etc.)
            res.status(200).json(usuarioMongo);
            
        } catch (error) {
            next(error);
        }
    }
}