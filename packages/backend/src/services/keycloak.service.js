import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

export class KeycloakService {

    async createUser({ username, password }) {

        const kcAdminClient = new KeycloakAdminClient({
            baseUrl: "http://localhost:8080"
        });

        await kcAdminClient.auth({
            username: "admin",
            password: "admin",
            grantType: "password",
            clientId: "admin-cli"
        });

        await kcAdminClient.users.create({
            realm: "tpi-realm",

            username,

            enabled: true,

            credentials: [
                {
                    type: "password",
                    value: password,
                    temporary: false
                }
            ]
        });
        const users = await kcAdminClient.users.find({
            realm: "tpi-realm",
            username
        })
        return users[0];
    }
}