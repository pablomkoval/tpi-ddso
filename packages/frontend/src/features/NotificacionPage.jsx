import { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Paper } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NotificacionFilter from "../components/NotificacionFilter.jsx";
import NotificacionCard from "../components/NotificacionCard.jsx";
import { obtenerNotificaciones, marcarNotificacionComoLeida, marcarTodasComoLeidas, obtenerResumenNotificaciones } from "../services/notificacionesService.js";

const NotificacionPage = () => {
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
  const paginaFinal = Math.max(totalPages, 1);
  const puedeIrAtras = page > 1 && !loading;
  const puedeIrAdelante = page < paginaFinal && !loading;

  useEffect(() => {
    cargarNotificaciones();
  }, [page, filter]);

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await obtenerNotificaciones(
        page,
        10,
        filter === "all"
          ? undefined
          : filter === "read"
            ? true
            : false
      );

      setNotificaciones(data.notificaciones);

      const totalPaginas = Math.max(Number(data.totalPages) || 1, 1);
      setTotalPages(totalPaginas);
      setPage((paginaActual) => Math.min(paginaActual, totalPaginas));

    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const cargarResumen = async () => {
    try {
      const data = await obtenerResumenNotificaciones();
      setResumen(data);
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleLeer = async (id) => {
    try {
      await marcarNotificacionComoLeida(id);

      setNotificaciones(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, leida: true }
            : n
        )
      );

      cargarResumen();

    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

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
        setFilter={(nuevoFiltro) => {
          setPage(1);
          setFilter(nuevoFiltro);
        }}
        resumen={resumen}
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
              onClick={async () => {
                await marcarTodasComoLeidas();
                cargarNotificaciones();
                cargarResumen();
              }}
              startIcon={<DoneAllIcon />}
              sx={{
                color: "text.primary",
                borderColor: "divider",
                "&:hover": { backgroundColor: "action.hover", borderColor: "text.primary" }
              }}
            >
              Marcar todas como leídas
            </Button>
          </Box>
        </Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Paper
          component="section"
          variant="outlined"
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "12px",
            overflow: "hidden"
          }}
        >
          {notificaciones.map((notificacion) => (
            <NotificacionCard
              key={notificacion.id}
              notificacion={notificacion}
              onMarcarLeida={handleLeer}
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
    </Box>
  );
};

export default NotificacionPage;
