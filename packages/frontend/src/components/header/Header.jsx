import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMenu from './HeaderMenu.jsx';
import { useCart } from '../../context/CartContext.jsx';

const navItems = [
  { text: 'Buscar Turnos', to: '/buscar-turnos' },
  { text: 'Mis Turnos', to: '/mis-turnos' },
  { text: 'Notificaciones', to: '/notificaciones' },
];

const Header = () => {
  const { carrito } = useCart();
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

        <HeaderMenu />

        <Box sx={{ flex: 1 }} />

        <Box sx={{
          display: { xs: 'none', sm: 'flex' }, alignItems: 'center',
          bgcolor: 'grey.100', borderRadius: 50, px: 2, py: 0.5, gap: 1
        }}>
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <InputBase placeholder="Buscar..." sx={{ fontSize: '0.875rem' }} />
        </Box>

        <IconButton color="primary" size="small" component={Link} to="/checkout">
          <Badge
            badgeContent={carrito.length}
            color="error"
            invisible={carrito.length === 0}
          >
            <ShoppingCartOutlinedIcon />
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
