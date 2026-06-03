import { UsuarioModel } from "../../../schemas/usuario.schema.js";

export class UsuarioRepository {
    constructor() {
        this.model = UsuarioModel;
    }

    async findOne(usuario) {
        return await this.model.findOne(usuario);
    }

}