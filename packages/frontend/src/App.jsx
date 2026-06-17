import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from './features/LoginPage.jsx';
import NotificacionPage from './features/NotificacionPage.jsx';
import BuscarTurnos from './features/BuscarTurnos/BuscarTurnos.jsx';
import DefinirDisponibilidad from './features/definirDisponibilidad/DefinirDisponibilidad.jsx';
import AgendaMedica from './features/agendaMedica/AgendaMedica.jsx';
import Checkout from './features/checkout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { ThemeProvider } from '@mui/material';
import LayoutPaciente from './features/LayoutPaciente/LayoutPaciente.jsx';
import LayoutMedico from './features/LayoutMedico/LayoutMedico.jsx';
import DashboardMedico from './features/DashboardMedico/DashboardMedico.jsx';
import MisTurnos from './features/MisTurnos/MisTurnos.jsx';
import Terminos from './features/Terminos/Terminos.jsx';
import Privacidad from './features/Privacidad/Privacidad.jsx';
import Ayuda from './features/Ayuda/Ayuda.jsx';
import DashboardPaciente from './features/DashboardPaciente/DashboardPaciente.jsx';
import DetalleTurno from './features/BuscarTurnos/DetalleTurno.jsx';
import theme from './theme/theme.js';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Routes>

        {/* PACIENTES */}
        <Route
          path="/paciente"
          element={
            <PrivateRoute requiredRole="paciente">
              <LayoutPaciente />
            </PrivateRoute>
          }
        >

          <Route index element={<DashboardPaciente />} />

          <Route path="buscar-turnos" element={<BuscarTurnos />} />

          <Route path="mis-turnos" element={ <MisTurnos /> } />

          <Route path="turnos/:id" element={ <DetalleTurno /> } />

          <Route path="notificaciones/" element={<NotificacionPage />} />

          {/* Si querés que también requiera login */}
          <Route path="checkout/" element={<Checkout />} />
        </Route>


        {/* MEDICOS */}
        <Route
          path="/medico"
          element={
            <PrivateRoute requiredRole="medico">
              <LayoutMedico />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardMedico />} />
          <Route path="agenda-medica" element={<AgendaMedica />} />
          <Route path="definir-disponibilidad" element={<DefinirDisponibilidad />} />
          <Route path="notificaciones" element={<NotificacionPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />

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