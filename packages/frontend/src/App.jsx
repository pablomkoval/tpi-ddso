import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import Layout from './features/Layout/Layout.jsx';
import LoginPage from './features/login/LoginPage.jsx';
import Home from './features/Home/Home.jsx';
import MisTurnos from './features/MisTurnos/MisTurnos.jsx';
import Notificaciones from './features/Notificaciones/Notificaciones.jsx';
import Terminos from './features/Terminos/Terminos.jsx';
import Privacidad from './features/Privacidad/Privacidad.jsx';
import Ayuda from './features/Ayuda/Ayuda.jsx';
import theme from './theme/theme.js';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/mis-turnos" element={<MisTurnos />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/ayuda" element={<Ayuda />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;