import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Layout from './features/layout/Layout.jsx';
import LoginPage from './features/LoginPage.jsx';
import NotificacionPage from './features/NotificacionPage.jsx';
import BuscarTurnos from './features/buscarTurnos/BuscarTurnos.jsx';
import DefinirDisponibilidad from './features/definirDisponibilidad/DefinirDisponibilidad.jsx';
import AgendaMedica from './features/agendaMedica/AgendaMedica.jsx';
import Checkout from './features/checkout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {

 return (
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
      {/* Solo pacientes */}
      <Route
        path="buscar-turnos"
        element={
          <PrivateRoute requiredRole="paciente">
            <BuscarTurnos />
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
);
}

export default App;