export const ZONA_HORARIA_ARGENTINA = 'America/Argentina/Buenos_Aires';

export function formatearFechaHora(isoString, options = {}) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('es-AR', {
    timeZone: ZONA_HORARIA_ARGENTINA,
    ...options,
  });
}

export function formatearFecha(isoString) {
  return formatearFechaHora(isoString, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatearHora(isoString) {
  return formatearFechaHora(isoString, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const DIA_SEMANA_POR_ABREVIATURA = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// Extrae los componentes de una fecha según el reloj de Argentina, sin importar
// la zona horaria del navegador donde corre la app.
export function obtenerPartesEnZonaArgentina(fecha) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_HORARIA_ARGENTINA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  });
  const partes = Object.fromEntries(
    formatter.formatToParts(fecha).map(({ type, value }) => [type, value]),
  );
  return {
    anio: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    hora: Number(partes.hour),
    minuto: Number(partes.minute),
    segundo: Number(partes.second),
    diaSemana: DIA_SEMANA_POR_ABREVIATURA[partes.weekday],
  };
}

export function esMismoDiaEnArgentina(fechaA, fechaB) {
  const a = obtenerPartesEnZonaArgentina(fechaA);
  const b = obtenerPartesEnZonaArgentina(fechaB);
  return a.anio === b.anio && a.mes === b.mes && a.dia === b.dia;
}