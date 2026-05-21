export class Notificacion{
    fechaHoraLeida = null;
    leida = false;
    
    constructor(destinatario, remitente, mensaje){
        this.id = "placeholder";
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = new Date();
    }

    marcarComoLeida(){
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }
}