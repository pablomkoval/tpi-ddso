import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import HeaderMedico from '../../components/header/HeaderMedico.jsx';
import Footer from '../../components/footer/Footer.jsx';

const LayoutMedico = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HeaderMedico />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default LayoutMedico;