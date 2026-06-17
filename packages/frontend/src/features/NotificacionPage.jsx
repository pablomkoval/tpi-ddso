import { useState } from "react";
import { Box, Typography, Button, IconButton, Paper } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NotificacionFilter from "../components/NotificacionFilter.jsx";
import NotificationCard from "../components/NotificacionCard.jsx";
import { notificacionesData } from "../mockdata/notificacionesData.js";

const NotificacionPage = () => {
  const [filter, setFilter] = useState("all");

  const notificacionesFiltradas = filter === "all" 
    ? notificacionesData 
    : notificacionesData.filter((n) => filter === "read" ? n.leida : !n.leida);

  const unreadCount = notificacionesData.filter((n) => !n.leida).length;

  return (
    <Box 
      sx={{
        display: "flex",
        // Responsive Layout: Columna en celulares/tablets (<900px), Fila en Desktop
        flexDirection: { xs: "column", md: "row" }, 
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "transparent"
      }}
    >
      <NotificacionFilter 
        filter={filter} 
        setFilter={setFilter} 
        unreadCount={unreadCount} 
      />

      <Box 
        component="main" 
        sx={{
          flex: 1,
          // Padding responsive: 24px 16px en móvil/tablet, 32px 48px en Desktop
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
            // Header colapsa a columna en móviles (<600px)
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
              // Los botones ocupan todo el ancho en móviles
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "space-between", sm: "flex-start" }
            }}
          >
            <Button 
              variant="outlined" 
              startIcon={<DoneAllIcon />}
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

        <Paper 
          component="section" 
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          {notificacionesFiltradas.map((notificacion) => (
            <NotificationCard
              key={notificacion.id}
              notificacion={notificacion}
            />
          ))}
        </Paper>

        <Box 
          component="footer" 
          sx={{
            display: "flex",
            // Footer colapsa a columna y se centra en móviles
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            mt: 3,
            gap: 2,
            textAlign: { xs: "center", sm: "left" }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Mostrando 1-{notificacionesFiltradas.length} de {notificacionesData.length} notificaciones
          </Typography>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton 
              size="small" 
              disabled 
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificacionPage;