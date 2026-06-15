import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import Layout from './features/layout/Layout.jsx';
//import Home from './features/home/Home.jsx';
import LoginPage from './features/login/LoginPage.jsx';



function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={
          <LoginPage />
        } />
      </Route>
    </Routes>
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



