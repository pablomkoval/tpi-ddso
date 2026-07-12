import { Typography, Box, Card, Divider, Stack } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

const Terminos = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 }, minHeight: '80vh', bgcolor: '#f9f9ff' }}>
      <Card variant="outlined" sx={{ p: 4, maxWidth: 800, width: '100%', textAlign: 'left', bgcolor: 'background.paper' }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: 'primary.main', mb: 2 }}>
          <DescriptionIcon fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Términos y Condiciones
          </Typography>
        </Stack>
        
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>
        Julio 2026
        </Typography>
        
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2.5} sx={{ color: 'text.secondary' }}>
          <Typography variant="body1">
            Bienvenido a <strong>Sweet Medical</strong>. Al utilizar nuestra plataforma web de gestión médica y turnos, usted acepta regirse por los siguientes términos de uso.
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            1. Uso del Sistema
          </Typography>
          <Typography variant="body2">
            Este software ha sido diseñado con fines estrictamente académicos e institucionales. Queda prohibido el ingreso de información médica real confidencial de pacientes fuera de los entornos controlados de simulación del proyecto.
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            2. Registro de Cuentas y Responsabilidad
          </Typography>
          <Typography variant="body2">
            Cada usuario (médico, paciente o administrador) es responsable de la confidencialidad de sus credenciales de acceso. Las acciones realizadas bajo su perfil registrado son de su exclusiva responsabilidad.
          </Typography>

          <Typography variant="h6" fontWeight={700} color="text.primary">
            3. Disponibilidad del Servicio
          </Typography>
          <Typography variant="body2">
            Al tratarse de una aplicación en entorno de desarrollo local, Sweet Medical no garantiza la persistencia o disponibilidad ininterrumpida de sus servidores de datos o servicios backend ante eventuales reinicios o reestructuraciones del repositorio.
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
};

export default Terminos;