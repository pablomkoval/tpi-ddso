import { Box, Avatar, Typography, Chip, Button } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { formatearFechaHora } from '../../utils/dateUtils';

const coberturaStyles = {
  NO_CUBIERTA: { bgcolor: '#ffebee', color: '#c62828', label: 'Sin Cobertura' },
  PARCIAL:     { bgcolor: 'primary.light', color: 'primary.main', label: 'Parcial' },
  COMPLETA:    { bgcolor: '#e0f5f5', color: 'secondary.main', label: 'Completa' },
};

const TurnoCard = ({ turno }) => {
  const { id, fechaHora, medico, sede, servicio, cobertura, costoPaciente } = turno;
  const navigate = useNavigate();

  const obtenerFechaFormateada = (isoString) =>
    isoString
      ? formatearFechaHora(isoString, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' hs'
      : '';

  const estiloActual = coberturaStyles[cobertura] || { bgcolor: 'grey.100', color: 'text.secondary', label: cobertura };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        gap: 2,
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Avatar sx={{ width: 72, height: 72, bgcolor: 'grey.200', color: 'text.secondary' }}>
        <PersonIcon fontSize="large" />
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h6" fontWeight={700}>{medico?.nombre || 'Profesional no asignado'}</Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          letterSpacing={1}
          color="primary"
          display="block"
        >
          {servicio?.nombre || 'Consulta general'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2">{obtenerFechaFormateada(fechaHora)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2">{sede?.nombre || 'Sede no especificada'}</Typography>
        </Box>
      </Box>

      {/* Sección precio + botones: wrappea a nueva fila en mobile */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'stretch', sm: 'flex-end' },
          gap: 1.5,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {/* Cobertura y precio: lado a lado en mobile, apilados en desktop */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            alignItems: { xs: 'center', sm: 'flex-end' },
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary" letterSpacing={0.5}>
              Cobertura:
            </Typography>
            <Chip
              label={estiloActual.label}
              size="small"
              sx={{ bgcolor: estiloActual.bgcolor, color: estiloActual.color, fontWeight: 600 }}
            />
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              ${(costoPaciente ?? 0).toLocaleString('es-AR')}
            </Typography>
            <Typography variant="caption" color="text.secondary" letterSpacing={0.5}>
              COSTO DEL TURNO
            </Typography>
          </Box>
        </Box>

        {/* Botones: se estiran en mobile */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/turnos/${turno.id}`)}
            sx={{ flex: { xs: 1, sm: 'initial' } }}
          >
            Ver detalles
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TurnoCard;
