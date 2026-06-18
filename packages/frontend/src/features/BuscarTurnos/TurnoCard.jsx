import { Box, Avatar, Typography, Chip, Button } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

const estadoStyles = {
  Parcial:  { bgcolor: 'primary.light',  color: 'primary.main' },
  Completa: { bgcolor: '#e0f5f5',        color: 'secondary.main' },
};

const TurnoCard = ({ turno }) => {
  const { nombre, especialidad, fecha, hora, sede, estado, precio } = turno;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
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

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight={700}>{nombre}</Typography>
        <Typography
          variant="caption"
          fontWeight={700}
          letterSpacing={1}
          color="primary"
          display="block"
        >
          {especialidad}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2">{fecha} {hora}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2">{sede}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
        <Chip
          label={estado}
          size="small"
          sx={{ ...estadoStyles[estado], fontWeight: 600 }}
        />
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h5" fontWeight={700} color="primary">
            ${precio.toLocaleString('es-AR')}
          </Typography>
          <Typography variant="caption" color="text.secondary" letterSpacing={0.5}>
            COSTO DEL TURNO
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => console.log('preselección', turno.id)}>
            Agregar a preselección
          </Button>
          <Button variant="contained" size="small" onClick={() => navigate(`/paciente/turnos/${turno.id}`)}>
            Reservar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TurnoCard;