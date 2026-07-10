import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Paper, 
  CircularProgress, 
  Alert, 
  Stack, 
  Chip, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PendingIcon from "@mui/icons-material/PendingActions";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import NotificacionFilter from "../components/NotificacionFilter.jsx";
import NotificationCard from "../components/NotificacionCard.jsx";
import { 
  getNotificaciones, 
  getNoLeidas,
  getLeidas,
  marcarNotificacionComoLeida, 
  getSolicitudesCambio, 
  confirmarSolicitudCambio, 
  rechazarSolicitudCambio 
} from "../services/notificacionesService";
import { getMiPaciente } from "../services/pacienteService";
import { getMiMedico } from "../services/medicoService";
import { getUserRoles } from "../utils/authUtils";

const NotificacionPage = () => {
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesMap, setSolicitudesMap] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal de Rechazo
  const [openRechazo, setOpenRechazo] = useState(false);
  const [rechazoSolicitudId, setRechazoSolicitudId] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener Rol de Usuario
      const roles = getUserRoles() || [];
      const isMedico = roles.includes("medico");
      const isPaciente = roles.includes("paciente");
      const roleStr = isMedico ? "medico" : isPaciente ? "paciente" : null;
      setUserRole(roleStr);

      // 2. Obtener Perfil del Usuario de forma segura (no bloqueante)
      let userProfile = null;
      try {
        if (isMedico) {
          userProfile = await getMiMedico();
        } else if (isPaciente) {
          userProfile = await getMiPaciente();
        }
        setProfile(userProfile);
      } catch (profileErr) {
        console.warn("No se pudo obtener el perfil de usuario:", profileErr);
      }

      // 3. Obtener Notificaciones Paginadas según filtro
      let notifData = { notificaciones: [], totalPages: 1, total: 0 };
      try {
        if (filter === "unread") {
          notifData = await getNoLeidas(page, limit);
        } else if (filter === "read") {
          notifData = await getLeidas(page, limit);
        } else {
          notifData = await getNotificaciones(page, limit);
        }
      } catch (notifErr) {
        console.error("Error al obtener notificaciones:", notifErr);
        setError("No se pudieron cargar las notificaciones. Verificá tu conexión o sesión.");
      }
      
      setNotificaciones(notifData.notificaciones || []);
      setTotalPages(notifData.totalPages || 1);
      setTotalItems(notifData.total || 0);

      // Obtener el conteo total de no leídas en segundo plano
      try {
        const unreadData = await getNoLeidas(1, 1);
        setUnreadCount(unreadData.total || 0);
      } catch (unreadErr) {
        console.warn("No se pudo obtener el conteo de no leídas:", unreadErr);
      }

      // 4. Obtener solicitudes de cambio de forma segura (no bloqueante)
      if (userProfile) {
        try {
          const entityId = userProfile.id || userProfile._id;
          const params = isMedico ? { medicoId: entityId } : { pacienteId: entityId };
          const solicitudesData = await getSolicitudesCambio(params);
          
          const list = solicitudesData?.solicitudes || [];
          setSolicitudes(list);

          const map = {};
          list.forEach((sol) => {
            map[sol.id] = sol.estado;
          });
          setSolicitudesMap(map);
        } catch (solErr) {
          console.warn("No se pudieron obtener las solicitudes de cambio:", solErr);
        }
      }
    } catch (err) {
      console.error("Error general en loadData:", err);
      setError("Ocurrió un error inesperado al cargar la página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleMarcarLeida = async (id) => {
    try {
      await marcarNotificacionComoLeida(id);
      setNotificaciones(prev => 
        prev.map(n => n.id === id ? { ...n, leida: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  const handleMarcarTodasComoLeidas = async () => {
    const unread = notificaciones.filter(n => !n.leida);
    if (unread.length === 0) return;

    try {
      await Promise.all(unread.map(n => marcarNotificacionComoLeida(n.id)));
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
    }
  };

  const handleAceptarCambio = async (solicitudId) => {
    if (!profile) return;
    const confirmadorId = profile.id || profile._id;
    try {
      setLoading(true);
      await confirmarSolicitudCambio(solicitudId, confirmadorId);
      await loadData();
    } catch (err) {
      console.error("Error al aceptar solicitud de cambio:", err);
      const apiError = err.response?.data?.message || "No se pudo confirmar el cambio de turno.";
      alert(apiError);
      setLoading(false);
    }
  };

  const handleRechazarCambioClick = (solicitudId) => {
    setRechazoSolicitudId(solicitudId);
    setOpenRechazo(true);
  };

  const handleConfirmarRechazo = async () => {
    if (!profile || !rechazoSolicitudId) return;
    const confirmadorId = profile.id || profile._id;
    try {
      setLoading(true);
      setOpenRechazo(false);
      await rechazarSolicitudCambio(rechazoSolicitudId, confirmadorId, motivoRechazo);
      setMotivoRechazo("");
      setRechazoSolicitudId(null);
      await loadData();
    } catch (err) {
      console.error("Error al rechazar solicitud de cambio:", err);
      const apiError = err.response?.data?.message || "No se pudo rechazar el cambio de turno.";
      alert(apiError);
      setLoading(false);
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "—";
    const f = new Date(fechaStr);
    return f.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    }) + " hs";
  };

  // Las notificaciones ya vienen filtradas desde el servidor
  const notificacionesFiltradas = notificaciones;

  // Solicitudes pendientes del médico para la sección destacada
  const solicitudesPendientes = solicitudes.filter(
    (s) => s.estado === "PENDIENTE"
  );

  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, 
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "transparent"
      }}
    >
      <NotificacionFilter 
        filter={filter} 
        setFilter={handleFilterChange} 
        unreadCount={unreadCount} 
      />

      <Box 
        component="main" 
        sx={{
          flex: 1,
          p: { xs: "24px 16px", md: "32px 48px" },
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden"
        }}
      >
        <Box 
          component="header" 
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Notificaciones
          </Typography>
          
          <Box 
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "space-between", sm: "flex-start" }
            }}
          >
            <Button 
              variant="outlined" 
              startIcon={<DoneAllIcon />}
              onClick={handleMarcarTodasComoLeidas}
              disabled={unreadCount === 0 || loading}
              sx={{
                color: "text.primary",
                borderColor: "divider",
                "&:hover": { backgroundColor: "action.hover", borderColor: "text.primary" }
              }}
            >
              Marcar todas como leídas
            </Button>
            <IconButton 
              sx={{
                border: "1px solid",
                borderColor: "divider"
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* Sección de Solicitudes de Cambio Pendientes (Médicos y Pacientes) */}
        {solicitudesPendientes.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" color="warning.main" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <PendingIcon /> Solicitudes de Cambio Pendientes
            </Typography>
            <Stack spacing={2}>
              {solicitudesPendientes.map((sol) => {
                const currentId = profile?.id || profile?._id;
                const esSolicitante = sol.solicitanteId && currentId && String(sol.solicitanteId) === String(currentId);

                return (
                  <Paper
                    key={sol.id}
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      borderColor: "warning.light",
                      backgroundColor: "#fffdf9",
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "stretch", md: "center" },
                      gap: 3
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                        Servicio: {sol.turnoOriginal?.servicio?.nombre || "—"}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}>
                        <Box sx={{ bgcolor: "#ffe0b2", px: 1.5, py: 0.5, borderRadius: "6px" }}>
                          <Typography variant="caption" color="warning.dark" fontWeight={600}>
                            Turno Original: {formatFecha(sol.turnoOriginal?.fechaHora)}
                          </Typography>
                        </Box>
                        <Box sx={{ bgcolor: "#c8e6c9", px: 1.5, py: 0.5, borderRadius: "6px" }}>
                          <Typography variant="caption" color="success.dark" fontWeight={600}>
                            Turno Propuesto: {formatFecha(sol.turnoNuevo?.fechaHora)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={1.5} sx={{ alignSelf: { xs: "flex-end", md: "center" }, flexShrink: 0 }}>
                      {esSolicitante ? (
                        <Chip
                          label={userRole === "medico" ? "Esperando respuesta del paciente" : "Esperando respuesta del médico"}
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => handleAceptarCambio(sol.id)}
                            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
                          >
                            Aceptar Cambio
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CloseIcon />}
                            onClick={() => handleRechazarCambioClick(sol.id)}
                            sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
                          >
                            Rechazar
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Box>
        )}

        <Paper 
          component="section" 
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
            minHeight: "150px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4, flex: 1 }}>
              <CircularProgress size={36} />
            </Box>
          )}

          {!loading && notificacionesFiltradas.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6, flex: 1 }}>
              <Typography variant="body1" color="text.secondary">
                No tenés notificaciones en esta sección.
              </Typography>
            </Box>
          )}

          {!loading && notificacionesFiltradas.map((notificacion) => (
            <NotificationCard
              key={notificacion.id}
              notificacion={notificacion}
              userRole={userRole}
              solicitudEstado={solicitudesMap[notificacion.referenciaId]}
              onAceptar={handleAceptarCambio}
              onRechazar={handleRechazarCambioClick}
              onMarcarLeida={handleMarcarLeida}
            />
          ))}
        </Paper>

        <Box 
          component="footer" 
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            mt: 3,
            gap: 2,
            textAlign: { xs: "center", sm: "left" }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Mostrando {notificacionesFiltradas.length > 0 ? (page - 1) * limit + 1 : 0}-
            {Math.min(page * limit, totalItems)} de {totalItems} notificaciones
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton 
              size="small" 
              disabled={page === 1 || loading}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton 
              size="small" 
              disabled={page >= totalPages || loading}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Diálogo Global de Motivo de Rechazo */}
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