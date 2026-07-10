import { Box } from '@mui/material';
import HeaderMenuElement from './HeaderMenuElement.jsx';

const HeaderMenuMedico = () => {
  return (
    <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' } }}>
      <HeaderMenuElement text="Agenda Médica" to="/agenda-medica" />
      <HeaderMenuElement text="Disponibilidad" to="/definir-disponibilidad" />
      <HeaderMenuElement text="Prestaciones" to="/gestionar-prestaciones" />
    </Box>
  );
};

export default HeaderMenuMedico;
