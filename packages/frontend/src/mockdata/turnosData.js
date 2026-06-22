const turnosData = [
  { id: 1, nombre: 'Dr. Juan Pérez',   especialidad: 'CARDIOLOGÍA',  fecha: '15/06/2026', hora: '15:30', sede: 'Sede Palermo',  estado: 'Parcial',  precio: 3500 },
  { id: 2, nombre: 'Dra. Elena Rossi', especialidad: 'CARDIOLOGÍA',  fecha: '16/06/2026', hora: '10:00', sede: 'Sede Palermo',  estado: 'Completa', precio: 4200 },
  { id: 3, nombre: 'Dr. Marcos Silva', especialidad: 'NEUROLOGÍA',   fecha: '17/06/2026', hora: '09:00', sede: 'Sede Belgrano', estado: 'Parcial',  precio: 2800 },
  { id: 4, nombre: 'Dra. Laura Gómez', especialidad: 'DERMATOLOGÍA', fecha: '18/06/2026', hora: '14:00', sede: 'Sede Centro',   estado: 'Completa', precio: 3100 },
];

async function obtenerTurnos() {
    return turnosData;
}

async function obtenerTurnoPorId(id) {
    return turnosData.find((turno) => turno.id === id) ?? null;
}

export { turnosData, obtenerTurnoPorId, obtenerTurnos };