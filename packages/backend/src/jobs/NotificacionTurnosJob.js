import nodeCron from "node-cron";
import dotenv from "dotenv";
import { turnoService } from "../dependencies.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const intervalMs = parseInt(process.env.JOBS_NOTIFICACIONES_INTERVAL_MS || 86400000);

const ejecutarEnvioRecordatorios = async () => {
    try {
        console.log("[NotificacionTurnosJob] Iniciando envío de recordatorios de turnos...");
        await turnoService.enviarRecordatoriosTurnos();
        console.log("[NotificacionTurnosJob] Proceso de envío de recordatorios finalizado.");
    } catch (error) {
        console.error("[NotificacionTurnosJob] Error al enviar recordatorios de turnos:", error);
    }
};

if (intervalMs < 60000 && intervalMs % 1000 === 0) {
    const intervalSegundos = Math.max(1, Math.floor(intervalMs / 1000));
    console.log(`[NotificacionTurnosJob] Programando recordatorios cada ${intervalSegundos} segundos.`);
    nodeCron.schedule(`*/${intervalSegundos} * * * * *`, ejecutarEnvioRecordatorios);
} else if (intervalMs % 86400000 === 0) {
    const intervalDias = Math.max(1, Math.floor(intervalMs / 86400000));
    console.log(`[NotificacionTurnosJob] Programando recordatorios cada ${intervalDias} día(s).`);
    nodeCron.schedule(`0 0 */${intervalDias} * *`, ejecutarEnvioRecordatorios);
} else {
    console.log(`[NotificacionTurnosJob] Programando recordatorios cada ${intervalMs} ms vía setInterval.`);
    setInterval(ejecutarEnvioRecordatorios, intervalMs);
}
