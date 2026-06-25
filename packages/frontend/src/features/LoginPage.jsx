import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginBox from "../components/sessionComponents/LoginBox.jsx";
import RegisterBox from "../components/sessionComponents/RegisterBox.jsx";
import { Box, Typography, Paper } from "@mui/material";
import { MedicalServices } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home", { replace: true });
      console.log(jwtDecode(token));
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, md: 0 },
        gap: { xs: 4, md: 6 },
        background:
          "linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)",
      }}
    >
      {/* Sección izquierda */}
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          maxWidth: "650px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: { xs: "center", lg: "left" },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", lg: "flex-start" },
            fontWeight: "bold",
            mb: 2,
            fontSize: { xs: "2rem", md: "2.8rem" },
          }}
        >
          <MedicalServices sx={{ fontSize: "1.2em", mr: 1 }} />
          Sweet Medical
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            color: "text.secondary",
            mb: 4,
            maxWidth: "550px",
            mx: { xs: "auto", lg: 0 },
          }}
        >
          Accedé a tu historial médico, gestioná y reservá turnos con
          profesionales de la salud en una plataforma centralizada y eficiente.
        </Typography>

        {/* Imagen mejor presentada */}
        <Paper
          elevation={6}
          sx={{
            overflow: "hidden",
            borderRadius: "20px",
            width: "100%",
            display: { xs: "none", md: "block" }, // oculta en mobile
          }}
        >
          <Box
            component="img"
            src="/images/landing.jpg"
            alt="Landing Sweet Medical"
            sx={{
              width: "100%",
              height: { md: "320px", lg: "420px" },
              objectFit: "cover",
              display: "block",
            }}
          />
        </Paper>
      </Box>

      {/* Sección derecha */}
      <Box
        sx={{
          width: { xs: "100%", sm: "85%", md: "450px" },
          display: "flex",
          justifyContent: "center",
        }}
      >
        {isRegistering ? (
          <RegisterBox onLoginClick={() => setIsRegistering(false)} />
        ) : (
          <LoginBox onRegisterClick={() => setIsRegistering(true)} />
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;