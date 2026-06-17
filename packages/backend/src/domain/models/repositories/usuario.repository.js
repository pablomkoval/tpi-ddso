import { UsuarioModel } from "../../../schemas/usuario.schema.js";

export class UsuarioRepository {
    constructor() {
        this.model = UsuarioModel;
    }

    async findAll() {
        return await this.model.find();
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findOne(usuario) {
        return await this.model.findOne(usuario);
    }

    async save(data) {
        const nuevoUsuario = new this.model(data);
        return await nuevoUsuario.save();
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }
}