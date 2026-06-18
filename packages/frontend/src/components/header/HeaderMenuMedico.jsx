import { Box } from '@mui/material';
import HeaderMenuElement from './HeaderMenuElement.jsx';

const HeaderMenuMedico = () => {
  return (
    <Box component="nav" sx={{ display: 'flex' }}>
      <HeaderMenuElement text="Agenda Médica" to="/medico/agenda-medica" />
      <HeaderMenuElement text="Disponibilidad" to="/medico/definir-disponibilidad" />
      <HeaderMenuElement text="Notificaciones" to="/medico/notificaciones" />
    </Box>
  );
};

export default HeaderMenuMedico;