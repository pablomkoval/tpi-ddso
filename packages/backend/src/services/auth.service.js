export class AuthService {

    constructor(keycloakService, usuarioService, pacienteService, medicoService) {
        this.keycloakService = keycloakService;
        this.usuarioService = usuarioService;
        this.pacienteService = pacienteService;
        this.medicoService = medicoService;
    }

    async register(data) {

        // const existeUsuario =
        //     await this.usuarioService.findByUsername(data.username);

        // if (existeUsuario) {
        //     throw new Error("Usuario ya existe");
        // }

        const kcUser = await this.keycloakService.createUser({
            username: data.username,
            password: data.password
        });

        await this.keycloakService.assignRole(
            kcUser.id,
            data.role
        );

        const usuario =
            await this.usuarioService.create({
                username: data.username,
                keycloakId: kcUser.id
            });

        if (data.role === "paciente") {

            return await this.pacienteService.create({
                nombre: data.nombre,
                dni: data.dni,
                obraSocial: data.obraSocial,
                plan: data.plan,
                usuario: usuario._id
            });
        }

        if (data.role === "medico") {

            return await this.medicoService.create({
                nombre: data.nombre,
                matricula: data.matricula,
                usuario: usuario._id
            });
        }

        throw new Error("Role inválido");
    }
}