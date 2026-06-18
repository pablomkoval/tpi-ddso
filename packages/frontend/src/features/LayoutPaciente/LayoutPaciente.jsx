import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../../components/header/Header.jsx';
import Footer from '../../components/footer/Footer.jsx';

const LayoutPaciente = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default LayoutPaciente;
