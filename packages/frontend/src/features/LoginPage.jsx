import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginBox from "../components/sessionComponents/LoginBox.jsx";
import RegisterBox from "../components/sessionComponents/RegisterBox.jsx";
import { Box, Typography } from "@mui/material";
import { MedicalServices } from "@mui/icons-material";
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Si ya está logueado, lo mandamos al inicio (dashboard)
            navigate("/home", { replace: true }); //mantener /home o "/" pero hacer que se renderice condicionalmente segun rol
            console.log(jwtDecode(token));
            console.log(jwtDecode(localStorage.getItem("token")));
            console.log("en loginPage");
        } else {
            console.log("caso else loginpage")
        }
    }, [navigate]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
                height: "100vh",
                width: "100vw",
                overflowX: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    m: { xs: 3, md: 6 },
                    width: { xs: "90%", md: "50%" },
                }}
            >
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        mb: 2,
                    }}
                >
                    <MedicalServices sx={{ fontSize: "1.2em", mr: 1 }} />
                    Sweet Medical
                </Typography>

                <Typography sx={{ fontSize: "1.2rem", mb: 3 }}>
                    Accede a tu historial médico, gestiona y agenda turnos con profesionales de la salud en una plataforma centralizada y eficiente.
                </Typography>

                <Box
                    component="img"
                    src="/images/landing.jpg"
                    alt="Landing Sweet Medical"
                    sx={{
                        width: "90%",
                        borderRadius: "0.8rem",
                        border: "0.15rem solid",
                        borderColor: "grey.800",
                    }}
                />
            </Box>

            {isRegistering ? (
                <RegisterBox onLoginClick={() => setIsRegistering(false)} />
            ) : (
                <LoginBox onRegisterClick={() => setIsRegistering(true)} />
            )}
        </Box>
    );
};

export default LoginPage;