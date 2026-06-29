import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMenuMedico from './HeaderMenuMedico.jsx';

const navItems = [
  { text: 'Agenda Médica', to: '/agenda-medica' },
  { text: 'Disponibilidad', to: '/definir-disponibilidad' },
  { text: 'Notificaciones', to: '/notificaciones' },
];

const HeaderMedico = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 3 }}>
        <Typography
          component={Link}
          to="/home"
          variant="h6"
          fontWeight={700}
          color="primary"
          sx={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Sweet Medical
        </Typography>

        <HeaderMenuMedico />

        <Box sx={{ flex: 1 }} />

        <IconButton color="error" size="small" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {navItems.map(({ text, to }) => (
            <MenuItem key={to} component={Link} to={to} onClick={handleMenuClose}>
              {text}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderMedico;
