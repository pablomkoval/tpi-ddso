import { Typography, Box, Card, Divider, Stack } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

const Privacidad = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 }, minHeight: '80vh', bgcolor: '#f9f9ff' }}>
      <Card variant="outlined" sx={{ p: 4, maxWidth: 800, width: '100%', textAlign: 'left', bgcolor: 'background.paper' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'primary.main', mb: 2 }}>
          <SecurityIcon fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Política de Privacidad
          </Typography>
        </Stack>
        
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
        Julio 2026
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2.5} sx={{ color: 'text.secondary' }}>
          <Typography variant="body1">
            En <strong>Sweet Medical</strong> nos tomamos muy en serio la seguridad y el tratamiento de la información cargada en nuestra cartilla y agenda médica.
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            1. Recopilación de Datos
          </Typography>
          <Typography variant="body2">
            La plataforma procesa información técnica básica orientada a la simulación médica: nombres de profesionales, especialidades, prácticas médicas, rangos horarios de atención y sedes físicas del centro de salud.
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            2. Seguridad y Autenticación
          </Typography>
          <Typography variant="body2">
            Todas las contraseñas e inicios de sesión son interceptados y protegidos mediante mecanismos de encriptación estándar en el backend, transmitiéndose a través de cabeceras seguras de autorización bajo tokens web JSON (JWT).
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            3. Destino de los Datos
          </Typography>
          <Typography variant="body2">
            Ningún dato almacenado en la base de datos local es compartido, comercializado o distribuido a entidades de salud externas ni a terceros. La base de datos es exclusivamente de uso académico.
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default Privacidad;