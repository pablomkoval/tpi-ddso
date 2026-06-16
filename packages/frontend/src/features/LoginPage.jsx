import { useState } from "react";
import LoginBox from "../components/sessionComponents/LoginBox.jsx";
import RegisterBox from "../components/sessionComponents/RegisterBox.jsx";
import { MedicalServices } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

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

                <Typography
                    sx={{
                        fontSize: "1.2rem",
                        mb: 3,
                    }}
                >
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