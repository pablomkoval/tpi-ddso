import { Notificacion } from "./Notification";

export class FactoryNotificacion{
    crearSegunEstadoTurno(turno){
        return new Notificacion({
            id: "placeholder",
            destinatario: "placeholder",
            remitente: "placeholder",
            mensaje: "placeholder",
        });
    }
}