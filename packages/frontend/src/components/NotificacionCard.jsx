import React from "react";
import { Box, Checkbox, Avatar, Typography, Button, Stack, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function NotificationCard({ notificacion, userRole, solicitudEstado, onAceptar, onRechazar, onMarcarLeida }) {
  const isUnread = !notificacion.leida;

  const fecha = new Date(notificacion.fechaHoraCreacion);
  const fechaFormateada = fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }) + " hs";

  const getAvatarStyles = (tipo) => {
    if (tipo === "CAMBIO_TURNO" || tipo === "turno") {
      return { backgroundColor: "#e3f2fd", color: "#1976d2" };
    }
    if (tipo === "recordatorio") {
      return { backgroundColor: "#fff3e0", color: "#ff9100" };
    }
    return { backgroundColor: "#f5f5f5", color: "#757575" };
  };

  const handleCardClick = () => {
    if (isUnread && onMarcarLeida) {
      onMarcarLeida(notificacion.id);
    }
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        padding: "16px 24px",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: isUnread ? "#f4f8fb" : "#ffffff",
        transition: "background-color 0.2s ease",
        cursor: isUnread ? "pointer" : "default",
        "&:hover": {
          backgroundColor: isUnread ? "#ebf3f7" : "#f9f9f9",
        },
        "&:last-child": {
          borderBottom: "none",
        },
        gap: 2,
        width: "100%"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "8px",
            height: "8px",
            backgroundColor: "#1976d2",
            borderRadius: "50%",
            position: "absolute",
            left: "-12px",
            visibility: isUnread ? "visible" : "hidden",
          }}
        />
        <Checkbox
          size="small"
          color="primary"
          checked={notificacion.leida}
          onChange={() => onMarcarLeida && onMarcarLeida(notificacion.id)}
          onClick={(e) => e.stopPropagation()}
          sx={{ padding: 0 }}
        />
      </Box>

      <Avatar
        sx={{
          width: "40px",
          height: "40px",
          ...getAvatarStyles(notificacion.tipo),
        }}
      >
        <NotificationsIcon fontSize="small" color="inherit" />
      </Avatar>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Typography variant="body2" color="text.primary" sx={{ fontWeight: isUnread ? 600 : 400 }}>
          {notificacion.mensaje}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fechaFormateada}
        </Typography>
      </Box>

      {/* Acciones para Cambio de Turno si el usuario es Médico */}
      {notificacion.tipo === "CAMBIO_TURNO" && notificacion.referenciaId && (
        <Box onClick={(e) => e.stopPropagation()} sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {/* Acciones para Cambio de Turno (Chips de estado) */}
          {solicitudEstado === "PENDIENTE" && (
            <Chip label="Pendiente de revisión" color="warning" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
          )}
          {solicitudEstado === "ACEPTADA" && (
            <Chip label={userRole === "medico" ? "Aceptado" : "Aprobado por médico"} color="success" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
          )}
          {solicitudEstado === "RECHAZADA" && (
            <Chip label={userRole === "medico" ? "Rechazado" : "Rechazado por médico"} color="error" variant="outlined" size="small" sx={{ fontWeight: 600 }} />
          )}
        </Box>
      )}
    </Box>
  );
}

export default NotificationCard;