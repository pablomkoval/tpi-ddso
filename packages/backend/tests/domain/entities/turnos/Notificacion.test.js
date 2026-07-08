import { Notificacion } from "../../../../src/domain/models/entities/turnos/Notificacion";
import { describe, test, expect } from "@jest/globals";

describe("Capa de dominio - Notificacion", () => {
    test("Debe inicializarse como no leida y cambiar su estado cuando se ejecute marcarComoLeida", () => {
        const datosNotificacion = {
            id: "6a173112ed88078b483f887c",
            destinatario: "Juan Perez",
            remitente: "Mariano Lopez",
            mensaje: "Turno confirmado"
        };

        const notificacion = new Notificacion(datosNotificacion);

        expect(notificacion.leida).toBe(false);
        expect(notificacion.fechaHoraLeida).toBeNull();

        notificacion.marcarComoLeida();

        expect(notificacion.leida).toBe(true);
        expect(notificacion.fechaHoraLeida).toBeInstanceOf(Date);
    })

    test("Debe crear una notificacion para el medico si el ultimo cambio lo hizo el paciente", () => {
        const mockTurno = {
            paciente: "6470abc12345678901234567",
            medico: "647012398765432109876543",
            historialEstados: [
                { estado: "Solicitado", motivo: "Control anual", usuario: "6470abc12345678901234567" },
                { estado: "Confirmado", motivo: "Paciente confirma asistencia", usuario: "6470abc12345678901234567" }
            ]
        };

        const notificacion = Notificacion.crearSegunEstadoTurno(mockTurno);

        expect(notificacion.destinatario).toBe("647012398765432109876543");
        expect(notificacion.remitente).toBe("6470abc12345678901234567");
        expect(notificacion.mensaje).toBe("El turno esta en estado: Confirmado por el motivo: Paciente confirma asistencia");
        expect(notificacion.leida).toBe(false);
        expect(notificacion.fechaHoraCreacion).toBeInstanceOf(Date);
    });
})