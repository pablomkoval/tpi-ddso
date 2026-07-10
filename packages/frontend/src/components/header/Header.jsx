import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HeaderMenu from './HeaderMenu.jsx';
import { obtenerCantidadNoLeidas } from '../../services/notificacionesService.js';

const navItems = [
  { text: 'Buscar Turnos', to: '/buscar-turnos' },
  { text: 'Mis Turnos', to: '/mis-turnos' },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);

  useEffect(() => {
    cargarCantidadNotificaciones();
  }, [location.pathname]);

  useEffect(() => {
    const actualizarContador = () => {
      cargarCantidadNotificaciones();
    };

    window.addEventListener(
      "actualizar-notificaciones",
      actualizarContador
    );

    return () => {
      window.removeEventListener(
        "actualizar-notificaciones",
        actualizarContador
      );
    };
  }, []);

  const cargarCantidadNotificaciones = async () => {
    try {
      const data = await obtenerCantidadNoLeidas();

      setCantidadNotificaciones(data.cantidad);

    } catch (error) {
      console.error(
        "Error cargando cantidad de notificaciones",
        error
      );

      setCantidadNotificaciones(0);
    }
  };

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

        <HeaderMenu />

        <Box sx={{ flex: 1 }} />

        <IconButton
          component={Link}
          to="/notificaciones"
          color="inherit"
          sx={{ color: 'text.primary' }}
        >
          <Badge
            badgeContent={cantidadNotificaciones}
            color="error"
            max={9}
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton color="error" size="small" onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>

        <IconButton
          color="inherit"
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

export default Header;
