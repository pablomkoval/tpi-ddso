import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url) });

export class KeycloakService {
    constructor() {
        let keycloakUrl = process.env.KEYCLOAK_URL || "http://localhost:8080";
        if (!keycloakUrl.startsWith("http://") && !keycloakUrl.startsWith("https://")) {
            keycloakUrl = `https://${keycloakUrl}`;
        }
        this.kcAdminClient = new KeycloakAdminClient({
            baseUrl: keycloakUrl
        });
    }

    async #authenticateAdmin() {
        await this.kcAdminClient.auth({
            username: process.env.KEYCLOAK_ADMIN_USER || "admin",
            password: process.env.KEYCLOAK_ADMIN_PASSWORD || "admin",
            grantType: "password",
            clientId: "admin-cli",
        });
    }

    async createUser({ username, password, nombre }) {
        await this.#authenticateAdmin();

        try {
            await this.kcAdminClient.users.create({
                realm: "tpi-realm", 
                username: username,
                email: username,
                firstName: nombre, 
                lastName: "SweetMedical",
                emailVerified: true,
                enabled: true,
                requiredActions: [],
                credentials: [
                    {
                        type: "password",
                        value: password,
                        temporary: false
                    }
                ]
            });

            const users = await this.kcAdminClient.users.find({ 
                realm: "tpi-realm",
                username 
            });
            
            return users[0];
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // Lanzamos un error que nuestro controlador pueda entender
                const customError = new Error("El correo electrónico ya se encuentra registrado en el sistema.");
                customError.status = 409;
                throw customError;
            }
            console.error("Error al crear usuario en Keycloak:", error.message);
            throw error; 
        }
    }

    async deleteAllUsers() {
        await this.#authenticateAdmin();

        const users = await this.kcAdminClient.users.find({
            realm: "tpi-realm",
            max: 1000,
        });

        for (const user of users) {
            await this.kcAdminClient.users.del({
                realm: "tpi-realm",
                id: user.id,
            });
        }
    }

    async assignRole(userId, roleName) {
        await this.#authenticateAdmin();

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const clients = await this.kcAdminClient.clients.find({
                realm: "tpi-realm"
            });

            const client = clients.find(c => c.clientId === "react-client");

            if (!client) {
                throw new Error("No existe el client react-client en tpi-realm");
            }

            const roles = await this.kcAdminClient.clients.listRoles({
                realm: "tpi-realm",
                id: client.id
            });

            const role = roles.find(r => r.name === roleName);

            if (!role) {
                throw new Error(`El rol ${roleName} no existe en el cliente react-client`);
            }

           await this.kcAdminClient.users.addClientRoleMappings({
                realm: "tpi-realm",
                id: userId,
                clientUniqueId: client.id,
                roles: [
                    {
                        id: role.id,
                        name: role.name
                    }
                ]
            });
            console.log(`Rol ${roleName} asignado exitosamente al usuario ${userId}`);
        } catch (error) {
            console.error("Error al asignar rol:", error.message);
            throw error;
        }
    }
}