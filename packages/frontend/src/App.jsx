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
import { jwtDecode } from 'jwt-decode';

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
            <Layout />
          </PrivateRoute>
        }>
        <Route index element={<RootRedirect />} />
        {/* Solo pacientes */}
        <Route
          path="/paciente"
          element={
            <PrivateRoute requiredRole="paciente">
              <LayoutPaciente />
            </PrivateRoute>
          }
        />

        <Route index element={
          <PrivateRoute requiredRole="paciente">
          <DashboardPaciente />
          </PrivateRoute>
          } 
        />

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

        {/* Solo médicos */}
          <Route
          path="/medico"
          element={
            <PrivateRoute requiredRole="medico">
              <LayoutMedico />
            </PrivateRoute>
          }

        <Route
          path="agenda-medica"
          element={
            <PrivateRoute requiredRole="medico">
              <AgendaMedica />
            </PrivateRoute>
          }
        />

        <Route index element={
          <PrivateRoute requiredRole="medico">
          <DashboardMedico />
          </PrivateRoute>
          } 
        />

        <Route path="definir-disponibilidad" element={
          <PrivateRoute requiredRole="medico">
          <DefinirDisponibilidad />
          </PrivateRoute>
          } 
        />


      <Route path="notificaciones/" element={
          <PrivateRoute>
            <NotificacionPage />
          </PrivateRoute>
        } />

    </Route>

    

    <Route
      path="/sin-permiso"
      element={
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <h2>Acceso denegado</h2>
          <p>No tenés permisos para ver esta página.</p>
        </div>
      }
    />
    </ThemeProvider>
  </Routes>
);
}

export default App;