import { Box, Checkbox, Avatar, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

function NotificationCard({ notificacion }) {
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
    if (tipo === "turno") {
      return { backgroundColor: "#e0f2f1", color: "#00bfa5" };
    }
    if (tipo === "recordatorio") {
      return { backgroundColor: "#fff3e0", color: "#ff9100" };
    }
    return {};
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        padding: "16px 24px",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "#f9f9f9",
        },
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginRight: "16px",
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
          sx={{ padding: 0 }}
        />
      </Box>

      <Avatar
        sx={{
          marginRight: "16px",
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
        <Typography variant="body2" color="text.secondary">
          {notificacion.mensaje}
        </Typography>
      </Box>

      <Box
        sx={{
          marginLeft: "16px",
          whiteSpace: "nowrap",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {fechaFormateada}
        </Typography>
      </Box>
    </Box>
  );
}

export default NotificationCard;