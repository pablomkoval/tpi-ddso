import { Box } from '@mui/material';
import HeaderMenuElement from './HeaderMenuElement.jsx';

const HeaderMenu = () => {
  return (
    <Box component="nav" sx={{ display: 'flex' }}>
      <HeaderMenuElement text="Buscar Turnos" to="/buscar-turnos" />
      <HeaderMenuElement text="Mis Turnos" to="/mis-turnos" />
      <HeaderMenuElement text="Notificaciones" to="/notificaciones" />
    </Box>
  );
};

export default HeaderMenu;
