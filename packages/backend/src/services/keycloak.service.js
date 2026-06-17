import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

export class KeycloakService {
    constructor() {
        this.kcAdminClient = new KeycloakAdminClient({
            baseUrl: "http://localhost:8080"
        });
    }

    async #authenticateAdmin() {
        await this.kcAdminClient.auth({
            username: "admin",
            password: "admin",
            grantType: "password",
            clientId: "admin-cli",
        });
    }

    async createUser({ username, password }) {
        await this.#authenticateAdmin();

        try {
            await this.kcAdminClient.users.create({
                realm: "tpi-realm", 
                username: username,
                email: username,
                firstName: "Usuario", 
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
            console.error("Error al crear usuario en Keycloak:", error.message);
            throw error; 
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