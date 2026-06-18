import { Box } from '@mui/material';
import HeaderMenuElement from './HeaderMenuElement.jsx';

const HeaderMenu = () => {
  return (
    <Box component="nav" sx={{ display: 'flex' }}>
      <HeaderMenuElement text="Buscar Turnos" to="/paciente/buscar-turnos" />
      <HeaderMenuElement text="Mis Turnos" to="/paciente/mis-turnos" />
      <HeaderMenuElement text="Notificaciones" to="/paciente/notificaciones" />
    </Box>
  );
};

export default HeaderMenu;
