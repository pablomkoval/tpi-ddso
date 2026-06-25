export class UsuarioService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async create(data) {
        return await this.usuarioRepository.save(data);
    }

    async findById(id){
        return await this.usuarioRepository.findById(id);
    }

    async findByUsername(username) {
        return await this.usuarioRepository.findOne({ username });
    }
}