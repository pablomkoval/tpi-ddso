import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HeaderMenuMedico from './HeaderMenuMedico.jsx';

const HeaderMedico = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
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

        <IconButton
          color="error"
          size="small"
          onClick={handleLogout}
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderMedico;