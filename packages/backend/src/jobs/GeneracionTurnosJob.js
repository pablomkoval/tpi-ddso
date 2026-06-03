import nodeCron from "node-cron";
import dotenv from "dotenv";
import { TurnoService } from "../services/turno.service.js";
import { TurnoRepository } from "../domain/models/repositories/turno.repository.js";
import { MedicoRepository } from "../domain/models/repositories/medico.repository.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const intervalMs = parseInt(process.env.JOBS_GENERAR_TURNOS_INTERVAL_MS || 86400000);

const ejecutarGeneracionTurnos = async () => {
    const turnoService = new TurnoService(
        new TurnoRepository(),
        null,
        null,
        null,
        new MedicoRepository(),
    );

    try {
        console.log("Generando turnos...");
        await turnoService.generarTurnos();
        console.log("Turnos generados exitosamente.");
    } catch (error) {
        console.error("Error al generar turnos:", error);
    }
};

if (intervalMs < 60000 && intervalMs % 1000 === 0) {
    const intervalSegundos = Math.max(1, Math.floor(intervalMs / 1000));
    nodeCron.schedule(`*/${intervalSegundos} * * * * *`, ejecutarGeneracionTurnos);
} else if (intervalMs % 86400000 === 0) {
    const intervalDias = Math.max(1, Math.floor(intervalMs / 86400000));
    nodeCron.schedule(`0 0 */${intervalDias} * *`, ejecutarGeneracionTurnos);
} else {
    setInterval(ejecutarGeneracionTurnos, intervalMs);
}