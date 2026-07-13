import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { UsuarioModel } from '../schemas/usuario.schema.js';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url) });

let rawKeycloakUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
if (!rawKeycloakUrl.startsWith('http://') && !rawKeycloakUrl.startsWith('https://')) {
    rawKeycloakUrl = `https://${rawKeycloakUrl}`;
}
const KEYCLOAK_URL = rawKeycloakUrl;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'tpi-realm';
const CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'react-client';

const client = jwksClient({
    jwksUri: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000, // 10 minutos
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            return callback(err, null);
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            message: 'No se proporcionó un token de autenticación',
            codigo: 'TOKEN_AUSENTE',
            timestamp: new Date().toISOString(),
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: 'Token inválido o expirado',
                codigo: 'TOKEN_INVALIDO',
                timestamp: new Date().toISOString(),
            });
        }

        try {
            // Buscar o crear el usuario en MongoDB automáticamente
            let usuarioMongo = await UsuarioModel.findOne({ keycloakId: decoded.sub });
            
            if (!usuarioMongo) {
                // Auto-registrar el usuario en MongoDB en su primer login
                usuarioMongo = await UsuarioModel.findOneAndUpdate(
                    { keycloakId: decoded.sub },
                    {
                        keycloakId: decoded.sub,
                        username: decoded.preferred_username || decoded.sub
                    },
                    { upsert: true, new: true }
                );
            }

            const rolesDelCliente = decoded.resource_access?.[CLIENT_ID]?.roles || [];

            req.user = {
                id: usuarioMongo._id.toString(),
                keycloakId: decoded.sub,
                username: decoded.preferred_username,
                //email: decoded.email,
                nombre: decoded.given_name,
                apellido: decoded.family_name,
                roles: rolesDelCliente,
                token: decoded,
            };

            next();
        } catch {
            return res.status(500).json({
                    status: 500,
                    message: 'Error al verificar el perfil del usuario',
                    codigo: 'ERROR_DB_AUTH'
                });
        }
    });
};


export const requiereRol = (rol) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles.includes(rol)) {
            return res.status(403).json({
                status: 403,
                message: `Acceso denegado: se requiere el rol "${rol}"`,
                codigo: 'ROL_INSUFICIENTE',
                timestamp: new Date().toISOString(),
            });
        }
        next();
    };
};
