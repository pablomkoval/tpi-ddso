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