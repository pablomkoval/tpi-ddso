import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from './features/LoginPage.jsx';
import NotificacionPage from './features/NotificacionPage.jsx';
import BuscarTurnos from './features/BuscarTurnos/BuscarTurnos.jsx';
import DefinirDisponibilidad from './features/definirDisponibilidad/DefinirDisponibilidad.jsx';
import AgendaMedica from './features/AgendaMedica/AgendaMedica.jsx';
import Checkout from './features/checkout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { ThemeProvider } from '@mui/material';
import MisTurnos from './features/MisTurnos/MisTurnos.jsx';
import DetalleTurno from './features/BuscarTurnos/DetalleTurno.jsx';
import theme from './theme/theme.js';
import HomePage from './features/HomePage.jsx';
import RoleLayout from './features/RoleLayout.jsx';

const RootRedirect = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

function App() {

  return (
    <ThemeProvider theme={theme}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/sin-permiso"
        element={
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2>Acceso denegado</h2>
            <p>No tenés permisos para ver esta página.</p>
          </div>
        } />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <RoleLayout />
          </PrivateRoute>
        }
        >
        <Route index element={<RootRedirect />} />

        <Route path="home" element={<HomePage/>} />

        {/* Solo pacientes */}

        <Route
          path="buscar-turnos"
          element={
            <PrivateRoute requiredRole="paciente">
              <BuscarTurnos />
            </PrivateRoute>
          }
        />

        <Route path="mis-turnos" element={
          <PrivateRoute requiredRole="paciente">
           <MisTurnos /> 
           </PrivateRoute>
          } 
        />

        <Route path="turnos/:id" element={
          <PrivateRoute requiredRole="paciente">
          <DetalleTurno /> 
          </PrivateRoute>    
          } 
        />

        <Route
          path="checkout"
          element={
            <PrivateRoute requiredRole="paciente">
              <Checkout />
            </PrivateRoute>
          }
        />
        

        {/* Solo médicos */}
        <Route
          path="definir-disponibilidad"
          element={
            <PrivateRoute requiredRole="medico">
              <DefinirDisponibilidad />
            </PrivateRoute>
          }
        />

        <Route
          path="agenda-medica"
          element={
            <PrivateRoute requiredRole="medico">
              <AgendaMedica />
            </PrivateRoute>
          }
        />


      <Route path="notificaciones/" element={<NotificacionPage />} />

    </Route>
  </Routes>
  </ThemeProvider>
);
}

export default App;