levantar una instancia de keyclloack en docker

docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev


Entra a http://localhost:8080 (usuario admin, contraseña admin).
Crear un Realm: Crea un nuevo realm,ejemplo, tpi-realm.
Crear el Cliente para el Frontend:
ir a Clients y crea uno nuevo (ej: react-client).
Configúralo como Public (o deshabilita Client Authentication).
En Valid Redirect URIs, agrega la URL de tu frontend: http://localhost:3000/*.
En Web Origins  http://localhost:3000.
Crear un Usuario: ir a Users, crea uno, y asígnale una contraseña en la pestaña Credentials (desmarca "Temporary").


en keycloack esta la opcion para crear usuarios y asignarlos 


uso en las rutas 
// router.js - ejemplo cuando actives las rutas
import { verifyToken, requiereRol } from '../middlewares/auth.middleware.js';
// Solo médicos
router.use('/agenda-medica',    verifyToken, requiereRol('medico'),   agendaRouter);