export class Notificacion{
    constructor(id, destinatario, remitente, mensaje){
        this.id = id;
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = new Date();
        this.leida = false;
        this.fechaHoraLeida = null;
    }

    marcarComoLeida(){
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }
}