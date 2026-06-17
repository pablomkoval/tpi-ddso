import { AppBar, Toolbar, Typography, Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link } from 'react-router-dom';
import HeaderMenu from './HeaderMenu.jsx';

const Header = () => {
  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ gap: 3 }}>
        <Typography
          component={Link}
          to="/paciente"
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
          display: 'flex', alignItems: 'center',
          bgcolor: 'grey.100', borderRadius: 50, px: 2, py: 0.5, gap: 1
        }}>
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <InputBase placeholder="Buscar..." sx={{ fontSize: '0.875rem' }} />
        </Box>

        <IconButton color="primary" size="small">
          <ShoppingCartOutlinedIcon />
        </IconButton>
        <IconButton color="primary" size="small">
          <AccountCircleOutlinedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
