export const TipoNotificacion = {
    INFO: "INFO",
    SOLICITUD_CAMBIO: "SOLICITUD_CAMBIO",
    RECORDATORIO: "RECORDATORIO",
};

export class Notificacion {
    fechaHoraLeida = null;
    leida = false;
    tipo = TipoNotificacion.INFO;
    referenciaId = null;

    constructor(destinatario, remitente, mensaje, tipo = TipoNotificacion.INFO, referenciaId = null) {
        this.destinatario = destinatario;
        this.remitente = remitente;
        this.mensaje = mensaje;
        this.tipo = tipo;
        this.referenciaId = referenciaId;
        this.fechaHoraCreacion = new Date();
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaHoraLeida = new Date();
    }

    static datosSegunEstadoTurno(turno) {

        const ultimoCambioEstado = turno.historialEstados[turno.historialEstados.length - 1];
        const motivo = ultimoCambioEstado.motivoCambio ?? ultimoCambioEstado.motivo;

        const destinatario = String(ultimoCambioEstado.usuario) === String(turno.paciente) ? turno.medico : turno.paciente;
        //Si el usuario es el paciente, destinatario=medico, de lo contrario destinatario=paciente

        const mensaje = "El turno está en estado: " + ultimoCambioEstado.estado + " Motivo: " + motivo;

        /* console.log({
            paciente: turno.paciente,
            medico: turno.medico,
            medicoUsuario: turno.medico.usuario,
            ultimoUsuario: ultimoCambioEstado.usuario
        });
        console.log(
            "¿Es cambio solicitado?",
            motivo
        ); */
        return {
            destinatario,
            remitente: ultimoCambioEstado.usuario,
            mensaje,
            tipo: TipoNotificacion.INFO,
            referenciaId: null
        }
    }
}
