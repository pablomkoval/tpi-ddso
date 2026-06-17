export class ObraSocialController {
    constructor(obraSocialService) {
        this.obraSocialService = obraSocialService;
    }

    async obtenerTodas(req, res, next) {
        try {
            const obrasSociales = await this.obraSocialService.obtenerTodas();

            res.status(200).json(obrasSociales);

        } catch (error) {
            console.error("ERROR OBTENIENDO OBRAS SOCIALES", error);
            next(error);
        }
    }
}