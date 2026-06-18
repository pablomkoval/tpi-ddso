import { Box } from '@mui/material';
import HeaderMenuElement from './HeaderMenuElement.jsx';

const HeaderMenuMedico = () => {
  return (
    <Box component="nav" sx={{ display: 'flex' }}>
      <HeaderMenuElement text="Agenda Médica" to="/agenda-medica" />
      <HeaderMenuElement text="Disponibilidad" to="/definir-disponibilidad" />
      <HeaderMenuElement text="Notificaciones" to="/notificaciones" />
    </Box>
  );
};

export default HeaderMenuMedico;