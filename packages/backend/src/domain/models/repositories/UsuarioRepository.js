import { UsuarioModel } from "../../../schemas/UsuarioSchema.js";

export default class UsuarioRepository {
    constructor() {
        this.model = UsuarioModel;
    }

    async findOne(usuario) {
        return await this.model.findOne(usuario);
    }

}