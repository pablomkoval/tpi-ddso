import { Box } from '@mui/material';
import HeaderMenuElement from './HeaderMenuElement.jsx';

const HeaderMenu = () => {
  return (
    <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' } }}>
      <HeaderMenuElement text="Buscar Turnos" to="/buscar-turnos" />
      <HeaderMenuElement text="Mis Turnos" to="/mis-turnos" />
    </Box>
  );
};

export default HeaderMenu;
