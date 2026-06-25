export class Notificacion{
    fechaHoraLeida = null;
    leida = false;
    
    constructor(destinatario, remitente, mensaje){
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = new Date();
    }

    marcarComoLeida(){
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }

    static crearSegunEstadoTurno(turno){

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