import { Typography, Box, Card, Divider, Stack } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Ayuda = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 }, minHeight: '80vh', bgcolor: '#f9f9ff' }}>
      <Card variant="outlined" sx={{ p: 4, maxWidth: 800, width: '100%', textAlign: 'left', bgcolor: 'background.paper' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'primary.main', mb: 2 }}>
          <HelpOutlineIcon fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Ayuda
          </Typography>
        </Stack>
        
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Guía de uso de la plataforma
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2.5} sx={{ color: 'text.secondary' }}>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            1. Gestión de Disponibilidad (Médicos)
          </Typography>
          <Typography variant="body2">
            Para cargar tus horarios, ingresá a la sección "Disponibilidad". Hacé clic en el botón del día que quieras configurar (recordá que ahora actúan de forma excluyente). Completá los rangos horarios de inicio/fin, seleccioná tu prestación, la sede física asignada y guardá los cambios.
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            2. Visualización de la Agenda Activa
          </Typography>
          <Typography variant="body2">
            Por diseño y optimización de la grilla, la tabla de disponibilidades no muestra registros de manera global. Para visualizar tus horarios de atención guardados, es obligatorio seleccionar primero el día de la semana correspondiente en el panel izquierdo.
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            3. Reserva de Turnos (Pacientes)
          </Typography>
          <Typography variant="body2">
            Desde la sección "Buscar Turnos", los pacientes pueden filtrar la cartilla médica por sede, profesional o especialidad para reservar su cita. Las citas confirmadas se verán reflejadas de inmediato en la sección "Mis Turnos" con el cálculo de cobertura correspondiente.
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default Ayuda;