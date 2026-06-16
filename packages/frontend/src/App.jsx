import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import Layout from './features/layout/Layout.jsx';
//import Home from './features/home/Home.jsx';
import LoginPage from './features/LoginPage.jsx';
import NotificacionPage from './features/NotificacionPage.jsx';
import BuscarTurnos from './features/buscarTurnos/BuscarTurnos.jsx';
import DefinirDisponibilidad from './features/definirDisponibilidad/DefinirDisponibilidad.jsx';
import AgendaMedica from './features/agendaMedica/AgendaMedica.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="buscar-turnos" element={<BuscarTurnos />} />
        <Route path="definir-disponibilidad" element={<DefinirDisponibilidad />} />
        <Route path="agenda-medica" element={<AgendaMedica />} />
        <Route path="notificaciones/" element={<NotificacionPage/>} />
      </Route>
      <Route path="/login" element={<LoginPage />}/>
    </Routes>
  );

}

export default App;