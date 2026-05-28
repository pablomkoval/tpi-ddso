import nodeCron from "node-cron";
import TurnoService from "../services/TurnoService";

const intervalMs = parseInt(process.env.JOBS_GENERAR_TURNOS_INTERVAL_MS || 86400000);
const intervalDias = Math.max(1, Math.floor(intervalMs / 86400000));

const cronExpression = `0 0 */${intervalDias} * *`;

nodeCron.schedule(cronExpression, async () => { 
    const turnoService = new TurnoService();
    try {
        await turnoService.generarTurnos();
        console.log("Turnos generados exitosamente");
    } catch (error) {
        console.error("Error al generar turnos:", error);
    }
});