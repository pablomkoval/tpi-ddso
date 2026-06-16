import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import React from 'react';
import Layout from './features/layout/Layout.jsx';
import LoginPage from './features/login/LoginPage.jsx';
import Home from './features/Home/Home.jsx';
import MisTurnos from './features/MisTurnos/MisTurnos.jsx';
import Notificaciones from './features/Notificaciones/Notificaciones.jsx';
import theme from './theme/theme.js';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/mis-turnos" element={<MisTurnos />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );

  // return (
  //   <ThemeProvider theme={theme}>
  //     <Routes>
  //       <Route path="/" element={<Layout carrito={carrito} />}>
  //         <Route index element={<Home />} />
  //         <Route
  //           path="/productos/:id"
  //           element={
  //             <ProductDetailPage
  //               carrito={carrito}
  //               actualizarCarrito={actualizarCarrito}
  //             />
  //           }
  //         />
  //         <Route
  //           path="/checkout"
  //           element={
  //             <Checkout
  //               carrito={carrito}
  //               limpiarCarrito={limpiarCarrito}
  //             />
  //           }
  //         />
  //       </Route>
  //     </Routes>
  //   </ThemeProvider>
  // );

  /*
  <div className="App">
  <header className="App-header">
  </header>
    </div>
  */
}

export default App;



