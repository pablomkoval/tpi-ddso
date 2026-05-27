import nodeCron from "node-cron";
import TurnoService from "../services/TurnoService";

nodeCron.schedule("*/30 * * * * *", async () => { 
    const turnoService = new TurnoService();
    try {
        await turnoService.generarTurnos();
        console.log("Turnos generados exitosamente");
    } catch (error) {
        console.error("Error al generar turnos:", error);
    }
})