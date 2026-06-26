import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Button,
  Divider,
  Avatar
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useCart } from "../context/CartContext";



const formatearFecha = (fechaString) => {
  const opciones = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString("es-AR", opciones).replace(',', ' a las') + ' hs';
};

const Checkout = () => {
  const { carrito, agregarTurno, eliminarTurno, limpiarCarrito } = useCart();

  const handleRemoveItem = (id) => {
    eliminarTurno(id);
  };

    const total = carrito.reduce((acc, item) => acc + (item.costoPaciente ?? 0), 0);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4,
        p: { xs: 2, md: 4 },
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "transparent",
        minHeight: "100vh"
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
        >
          <EventAvailableIcon color="primary" fontSize="large" />
          Tus Turnos a Confirmar ({carrito.length})
        </Typography>

        {carrito.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 5, textAlign: "center", borderRadius: "12px" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tenés turnos pendientes de confirmación.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Buscar nuevos turnos
            </Button>
          </Paper>
        ) : (
          <Stack sx={{ gap: 2 }}>
            {carrito.map((turno) => (
              <Paper
                key={turno.id}
                variant="outlined"
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                  backgroundColor: "background.paper",
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderColor: "primary.main"
                  }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: "primary.light", 
                      color: "primary.dark",
                      width: 56, 
                      height: 56 
                    }}
                  >
                    <LocalHospitalIcon />
                  </Avatar>
                  
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                      {turno.servicio?.nombre}
                    </Typography>

                    <Stack spacing={0.5} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon fontSize="small" /> {turno.medico?.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1, textTransform: 'capitalize' }}>
                        <CalendarMonthIcon fontSize="small" /> {formatearFecha(turno.fechaHora)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOnIcon fontSize="small" /> {turno.sede?.nombre}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "flex-end", sm: "center" },
                    width: { xs: "100%", sm: "auto" },
                    borderTop: { xs: "1px solid", sm: "none" },
                    borderColor: "divider",
                    pt: { xs: 2, sm: 0 },
                    gap: 3
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ minWidth: "100px", textAlign: "right" }}>
                    ${(turno.costoPaciente ?? 0).toLocaleString("es-AR")}
                  </Typography>
                  <IconButton 
                    color="error" 
                    onClick={() => handleRemoveItem(turno.id)}
                    sx={{ backgroundColor: "error.light", '&:hover': { backgroundColor: "error.main", color: "white" } }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={{ width: { xs: "100%", md: "380px" } }}>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: "16px",
            backgroundColor: "background.paper",
            position: { md: "sticky" },
            top: { md: "24px" }
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Resumen de Reserva
          </Typography>

          <Stack sx={{ gap: 2, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal ({carrito.length} turnos)
              </Typography>
              <Typography variant="body2" fontWeight="600">
                ${total.toLocaleString("es-AR")}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" fontWeight="bold">
                A pagar hoy
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                ${total.toLocaleString("es-AR")}
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={carrito.length === 0}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: "0 8px 16px rgba(0, 94, 184, 0.15)"
            }}
          >
            Confirmar y Pagar
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
            Al confirmar, aceptás los términos y condiciones de Sweet Medical.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Checkout;