export class PacienteService {
    constructor(pacienteRepository, usuarioRepository) {
        this.pacienteRepository = pacienteRepository
        this.usuarioRepository = usuarioRepository //igual que medico, definir si es necesario
    }

    async create(data) {
        return {
            message: "Paciente creado",
            data,
        };
    }

    async update(id, data) {
        return {
            message: `Paciente ${id} actualizado`,
            data,
        };
    }

    async findAll() {
        return [];
    }

    async findById(id) {
        return {
            id,
            nombre: "Paciente de prueba",
        };
    }
}