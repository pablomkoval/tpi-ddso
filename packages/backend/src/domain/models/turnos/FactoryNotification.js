import { Notificacion } from "./Notification";

export class FactoryNotificacion{ // instanciar un objeto notificacion segun switch de estadoTurno
    crearSegunEstadoTurno(turno){

        const ultimoCambioEstado = turno.historialEstados[turno.historialEstados.length - 1];

        const destinatario = ultimoCambioEstado.usuario === turno.paciente ? turno.medico : turno.paciente; 
        //Si el usuario es el paciente, destinatario=medico, de lo contrario destinatario=paciente

        const mensaje = "El turno esta en estado: " + ultimoCambioEstado.estado + " por el motivo: "+ ultimoCambioEstado.motivo;

        
        return new Notificacion(
            destinatario, //destinatario
            ultimoCambioEstado.usuario, //remitente
            mensaje
        );
    }
}