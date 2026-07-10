export class Notificacion{
    fechaHoraLeida = null;
    leida = false;
    tipo = "INFO";
    referenciaId = null;
    
    constructor(destinatario, remitente, mensaje, tipo = "INFO", referenciaId = null){
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.referenciaId = referenciaId;
        this.fechaHoraCreacion = new Date();
    }

    marcarComoLeida(){
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }

    static crearSegunEstadoTurno(turno){

        const ultimoCambioEstado = turno.historialEstados[turno.historialEstados.length - 1];
        const motivo = ultimoCambioEstado.motivoCambio ?? ultimoCambioEstado.motivo;

        const destinatario = ultimoCambioEstado.usuario.toString() === turno.paciente.toString() ? turno.medico : turno.paciente; 
        //Si el usuario es el paciente, destinatario=medico, de lo contrario destinatario=paciente

        const mensaje = "El turno esta en estado: " + ultimoCambioEstado.estado + " por el motivo: "+ motivo;

        
        return new Notificacion(
            destinatario, //destinatario
            ultimoCambioEstado.usuario, //remitente
            mensaje
        );
    }
}
