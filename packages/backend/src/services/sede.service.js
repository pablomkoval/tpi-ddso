import { UnprocessableEntityError } from "../shared/errors/AppError.js";
import { Sede } from "../domain/models/entities/medico/Sede.js";

export class SedeService {
    constructor(sedeRepository) {
        this.sedeRepository = sedeRepository;
    }


    async create(data) {
        const { nombre, direccion } = data;

        if (!nombre || !direccion) {
            throw new UnprocessableEntityError("Los datos para la sede no son válidos");
        }

        const nuevaSede = new Sede(nombre, direccion);

        return await this.sedeRepository.save(nuevaSede);;
    }

    async findAll() {
        return await this.sedeRepository.findAll();
    }
}