import React from "react";
import { Box, Checkbox, Avatar, Typography, Button, Stack, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function NotificacionCard({ notificacion, onMarcarLeida }) {
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
    switch (tipo) {
      case "turno":
        return {
          backgroundColor: "#e0f2f1",
          color: "#00bfa5",
        };

      case "recordatorio":
        return {
          backgroundColor: "#fff3e0",
          color: "#ff9100",
        };

      default:
        return {
          backgroundColor: "#e3f2fd",
          color: "#1976d2",
        };
    }
  };
  const handleClick = () => {
    if (isUnread) {
      onMarcarLeida(notificacion.id);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        px: 3,
        py: 2,
        cursor: "pointer",
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: isUnread ? "#f5f9ff" : "background.paper",
        transition: "all .2s ease",

        "&:hover": {
          backgroundColor: "#eef5ff",
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
          width: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {isUnread && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "primary.main",
            }}
          />
        )}
      </Box>

      <Avatar
        sx={{
          width: 42,
          height: 42,
          ...getAvatarStyles(notificacion.tipo),
        }}
      >
        <NotificationsIcon fontSize="small" />
      </Avatar>

      <Box sx={{ 
        flex: 1,
        minWidth: 0,
        }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: isUnread ? 600 : 400,
          }}
        >
          {notificacion.mensaje}
        </Typography>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          whiteSpace: "nowrap",
          ml: 2,
        }}
      >
        {fechaFormateada}
      </Typography>
    </Box>
  );
}

export default NotificacionCard;