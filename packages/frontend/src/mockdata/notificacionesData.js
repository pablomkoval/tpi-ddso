const notificacionesData = [
    {
        "id": "6a17cab19e4972528d80fb56",
        "destinatario": "6470abc12345678901234567",
        "remitente": "647012398765432109876543",
        "mensaje": "Su turno con el Dr. Pérez ha sido confirmado para el 15/06.",
        "leida": true,
        "fechaHoraCreacion": "2026-05-28T04:55:13.871Z"
    },
    {
        "id": "6a317b030ceb05ffc51e4f84",
        "destinatario": "6470abc12345678901234567",
        "remitente": "647012398765432109876543",
        "mensaje": "Su turno con el Dr. Ramirez ha sido confirmado para el 21/06.",
        "leida": false,
        "fechaHoraCreacion": "2026-06-16T16:34:11.026Z"
    }
];

async function obtenerNotificaciones() {
    return notificacionesData;
}

async function obtenerNotificacionPorId(id) {
    return notificacionesData.find((notificacion) => notificacion.id === id) ?? null;
}

export { notificacionesData, obtenerNotificacionPorId, obtenerNotificaciones };