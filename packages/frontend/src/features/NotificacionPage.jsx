import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NotificacionFilter from "../components/NotificacionFilter.jsx";
import NotificacionCard from "../components/NotificacionCard.jsx";

// Importamos tus servicios y agregamos los de tu compañero para los cambios de turno
import {
  obtenerNotificaciones,
  marcarNotificacionComoLeida,
  marcarTodasComoLeidas,
  obtenerResumenNotificaciones,
  confirmarSolicitudCambio,
  rechazarSolicitudCambio
} from "../services/notificacionesService.js";

const NotificacionPage = () => {
  // ─── TUS ESTADOS (BASE SÓLIDA) ───
  const [filter, setFilter] = useState("all");
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resumen, setResumen] = useState({
    total: 0,
    leidas: 0,
    noLeidas: 0
  });

  // ─── ESTADOS DE TU COMPAÑERO (MODAL DE RECHAZO) ───
  const [openRechazo, setOpenRechazo] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [notificacionSeleccionadaParaRechazo, setNotificacionSeleccionadaParaRechazo] = useState(null);

  // ─── LÓGICA DE PAGINACIÓN ───
  const paginaFinal = Math.max(totalPages, 1);
  const puedeIrAtras = page > 1 && !loading;
  const puedeIrAdelante = page < paginaFinal && !loading;

  // ─── EFECTOS ───
  useEffect(() => {
    cargarNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  useEffect(() => {
    cargarResumen();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // ─── FUNCIONES DE CARGA ───
  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      setError(null);

      let leida;

      switch (filter) {
        case "read":
          leida = true;
          break;
        case "unread":
          leida = false;
          break;
        default:
          leida = undefined;
      }

      const data = await obtenerNotificaciones(page, 10, leida);

      setNotificaciones(data.notificaciones || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setError("No se pudieron cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  const cargarResumen = async () => {
    try {
      const data = await obtenerResumenNotificaciones();
      setResumen(data);
    } catch (err) {
      console.error("Error al cargar resumen:", err);
    }
  };

  const actualizarNavbar = () => {
    window.dispatchEvent(new Event("actualizar-notificaciones"));
  };

  // ─── ACCIONES DE NOTIFICACIONES (TUS FUNCIONES) ───
  const handleLeer = async (id) => {
    try {
      await marcarNotificacionComoLeida(id);

      await cargarNotificaciones();
      await cargarResumen();

      actualizarNavbar();
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  const handleMarcarTodasLeidas = async () => {
    try {
      await marcarTodasComoLeidas();

      await cargarNotificaciones();
      await cargarResumen();

      actualizarNavbar();
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
    }
  };

  // ─── ACCIONES DE CAMBIO DE TURNO (DE TU COMPAÑERO) ───
  const handleAceptarCambio = async (idNotificacion, idTurno) => {
    try {
      await confirmarSolicitudCambio(idTurno);
      await handleLeer(idNotificacion);
      cargarNotificaciones();
    } catch (err) {
      console.error("Error al aceptar el cambio:", err);
      setError("No se pudo aceptar el cambio de turno.");
    }
  };

  const abrirModalRechazo = (idNotificacion, idTurno) => {
    setNotificacionSeleccionadaParaRechazo({ idNotificacion, idTurno });
    setMotivoRechazo("");
    setOpenRechazo(true);
  };

  const handleConfirmarRechazo = async () => {
    if (!notificacionSeleccionadaParaRechazo) return;

    try {
      await rechazarSolicitudCambio(
        notificacionSeleccionadaParaRechazo.idTurno,
        motivoRechazo
      );
      await handleLeer(notificacionSeleccionadaParaRechazo.idNotificacion);
      setOpenRechazo(false);
      setNotificacionSeleccionadaParaRechazo(null);
      cargarNotificaciones();
    } catch (err) {
      console.error("Error al rechazar el cambio:", err);
      setError("No se pudo rechazar el cambio de turno.");
    }
  };

  return (
    // Contenedor principal corregido para que se estire al 100% simétricamente
    <Box
      sx={{
        width: "100%",
        maxWidth: 1280,
        mx: "auto",
        p: { xs: 2, md: 3 },
        boxSizing: "border-box",
      }}
    >

      {/* Cabecera perfectamente alineada */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Notificaciones
        </Typography>
        <Button
          startIcon={<DoneAllIcon />}
          variant="outlined"
          onClick={handleMarcarTodasLeidas}
          disabled={resumen.noLeidas === 0 || loading}
        >
          Marcar todas como leídas
        </Button>
      </Box>

      {/* Resumen y Filtros */}

      <Box sx={{ mb: 3 }}>
        <NotificacionFilter filter={filter} setFilter={setFilter} resumen={resumen} />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, width: "100%" }}>{error}</Alert>}

      {/* Caja de contenido unificada para evitar desalineación */}
      <Box sx={{ width: "100%" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200, width: "100%" }}>
            <CircularProgress />
          </Box>
        ) : notificaciones.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", color: "text.secondary", width: "100%", elevation: 1 }}>
            No hay notificaciones para mostrar.
          </Paper>
        ) : (
          // El Paper ahora ocupa el 100% de manera consistente
          <Paper
            elevation={1}
            sx={{
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            {notificaciones.map((notificacion) => (
              <NotificacionCard
                key={notificacion.id || notificacion._id}
                notificacion={notificacion}
                onMarcarLeida={() => handleLeer(notificacion.id || notificacion._id)}
                onAceptarCambio={() => handleAceptarCambio(notificacion.id, notificacion.referenciaTurnoId)}
                onRechazarCambio={() => abrirModalRechazo(notificacion.id, notificacion.referenciaTurnoId)}
              />
            ))}
          </Paper>
        )}

        {/* Footer de Paginación alineado con los bordes del bloque de tarjetas */}
        <Box
          component="footer"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Mostrando página {page} de {totalPages}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              disabled={!puedeIrAtras}
              onClick={() => setPage((paginaActual) => Math.max(paginaActual - 1, 1))}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              size="small"
              disabled={!puedeIrAdelante}
              onClick={() => setPage((paginaActual) => Math.min(paginaActual + 1, paginaFinal))}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Modal de Rechazo */}
      <Dialog open={openRechazo} onClose={() => setOpenRechazo(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Rechazar Solicitud de Cambio</DialogTitle>
        <DialogContent sx={{ minWidth: 320 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Por favor, especificá el motivo por el cual rechazás el cambio de turno solicitado por el paciente.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo de rechazo"
            type="text"
            fullWidth
            variant="outlined"
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRechazo(false)} variant="text" color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmarRechazo} variant="contained" color="error" disabled={!motivoRechazo.trim()}>
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificacionPage;