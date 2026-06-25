export const horasAgenda = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00'
];

export const turnosMedicos = [
  {
    id: 1,
    paciente: 'Carlos Ruiz',
    motivo: 'Consulta Gral.',
    estado: 'completado',
    columna: 1,
    top: 30,
    height: 60
  },
  {
    id: 2,
    paciente: 'Elena Gómez',
    motivo: 'Control Post-Op',
    estado: 'reservado',
    columna: 2,
    top: 120,
    height: 90
  },
  {
    id: 3,
    paciente: 'Mateo Sosa',
    motivo: 'Primera vez',
    estado: 'pendiente',
    columna: 3,
    top: 360,
    height: 60
  },
  {
    id: 4,
    paciente: 'Lucía Ferreyra',
    motivo: 'Recetas',
    estado: 'reservado',
    columna: 5,
    top: 60,
    height: 60
  }
];

export const agendaStats = {
  completados: 24,
  proximasCitas: 12,
  cambiosSolicitados: 3
};

export const agendaSemana = {
  inicio: "2026-05-20"
};