import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Layout from './features/layout/Layout.jsx';
import LoginPage from './features/LoginPage.jsx';
import NotificacionPage from './features/NotificacionPage.jsx';
import BuscarTurnos from './features/buscarTurnos/BuscarTurnos.jsx';
import DefinirDisponibilidad from './features/definirDisponibilidad/DefinirDisponibilidad.jsx';
import AgendaMedica from './features/agendaMedica/AgendaMedica.jsx';
import Checkout from './features/checkout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { jwtDecode } from 'jwt-decode';

const RootRedirect = () => {
  const token = localStorage.getItem("token");
  if (token) {

    console.log(jwtDecode(token));
    console.log(jwtDecode(localStorage.getItem("token")));
    console.log("en app");
    console.log(jwtDecode(token).realm_access);
    console.log(jwtDecode(token).resource_access);
  } else {
    console.log("caso else app")
  }
  return token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

function App() {

  return (
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
          path="buscar-turnos"
          element={
            <PrivateRoute requiredRole="paciente">
              <BuscarTurnos />
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
          path="agenda-medica"
          element={
            <PrivateRoute requiredRole="medico">
              <AgendaMedica />
            </PrivateRoute>
          }
        />

        <Route path="notificaciones/" element={
          <PrivateRoute>
            <NotificacionPage />
          </PrivateRoute>
        } />

      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;