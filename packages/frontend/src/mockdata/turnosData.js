const turnosData = [
  {
    id: "6470abc123",
    medico: "Dr. Roberto Pérez",
    fechaHora: "2026-06-20T10:00:00Z",
    servicio: "Cardiología Clínica",
    sede: "Sede Central - Banfield",
    costo: 15000,
    estado: "RESERVADO"
  },
  {
    id: "6470abc456",
    medico: "Dra. María Gómez",
    fechaHora: "2026-06-25T16:30:00Z",
    servicio: "Ecografía Doppler",
    sede: "Sede Norte - Lomas de Zamora",
    costo: 22000,
    estado: "RESERVADO"
  }
];

async function obtenerTurnos() {
    return turnosData;
}

async function obtenerTurnoPorId(id) {
    return turnosData.find((turno) => turno.id === id) ?? null;
}

export { turnosData, obtenerTurnoPorId, obtenerTurnos };