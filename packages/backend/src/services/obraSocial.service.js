export class ObraSocialService {
    constructor(obraSocialRepository) {
        this.obraSocialRepository = obraSocialRepository;
    }

    async obtenerTodas() {
        const obrasSociales = await this.obraSocialRepository.findAll();
        
        return obrasSociales;
    }
}