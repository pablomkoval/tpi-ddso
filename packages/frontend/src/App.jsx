import { Routes, Route } from 'react-router-dom';
import React from 'react';
import LoginPage from './features/LoginPage.jsx';
import NotificacionPage from './features/NotificacionPage.jsx';
import BuscarTurnos from './features/BuscarTurnos/BuscarTurnos.jsx';
import DefinirDisponibilidad from './features/definirDisponibilidad/DefinirDisponibilidad.jsx';
import AgendaMedica from './features/agendaMedica/AgendaMedica.jsx';
import Checkout from './features/checkout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { ThemeProvider } from '@mui/material';
import Layout from './features/Layout/Layout.jsx';
import MisTurnos from './features/MisTurnos/MisTurnos.jsx';
import Terminos from './features/Terminos/Terminos.jsx';
import Privacidad from './features/Privacidad/Privacidad.jsx';
import Ayuda from './features/Ayuda/Ayuda.jsx';
import DashboardPaciente from './features/DashboardPaciente/DashboardPaciente.jsx';
import theme from './theme/theme.js';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Routes>

        {/*
    <Route path="/" element={<Layout />}>
      <Route path="buscar-turnos" element={<BuscarTurnos />} />
      <Route path="definir-disponibilidad" element={<DefinirDisponibilidad />} />
      <Route path="agenda-medica" element={<AgendaMedica />} />
      <Route path="notificaciones/" element={<NotificacionPage />} />
      <Route path="checkout/" element={<Checkout />} />
    </Route>
    */}

        {/* Layout principal autenticado */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPaciente />} />

          {/* Solo pacientes */}
          <Route
            path="buscar-turnos"
            element={
              <PrivateRoute requiredRole="paciente">
                <BuscarTurnos />
              </PrivateRoute>
            }
          />

          <Route
            path="mis-turnos"
            element={
              <PrivateRoute requiredRole="paciente">
                <MisTurnos />
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

          {/* Solo médicos */}
          <Route
            path="agenda-medica"
            element={
              <PrivateRoute requiredRole="medico">
                <AgendaMedica />
              </PrivateRoute>
            }
          />

          <Route path="notificaciones/" element={<NotificacionPage />} />

          {/* Si querés que también requiera login */}
          <Route path="checkout/" element={<Checkout />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/sin-permiso"
          element={
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <h2>Acceso denegado</h2>
              <p>No tenés permisos para ver esta página.</p>
            </div>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;