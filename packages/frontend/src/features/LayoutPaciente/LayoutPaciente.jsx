import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../../components/header/Header.jsx';
import Footer from '../../components/footer/Footer.jsx';
import { CartProvider } from '../../context/CartContext.jsx';

const LayoutPaciente = () => {
  return (
    <CartProvider>
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
    </CartProvider>
  );
};

export default LayoutPaciente;
