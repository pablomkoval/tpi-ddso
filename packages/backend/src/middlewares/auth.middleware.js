import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'tpi-realm';

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

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: 401,
                message: 'Token inválido o expirado',
                codigo: 'TOKEN_INVALIDO',
                timestamp: new Date().toISOString(),
            });
        }

        req.user = {
            id: decoded.sub,
            username: decoded.preferred_username,
            email: decoded.email,
            nombre: decoded.given_name,
            apellido: decoded.family_name,
            roles: decoded.realm_access?.roles || [],
            token: decoded,
        };

        next();
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
