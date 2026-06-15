import { useState } from "react";
import LoginBox from "../../components/loginBox/LoginBox.jsx";
import RegisterBox from "../../components/registerBox/RegisterBox.jsx";
import { MedicalServices } from "@mui/icons-material";
import "./LoginPage.css";
import { Box } from "@mui/material";

const LoginPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <div className="landing-body">
            <div className="presentacion-body">
                <h2 className="titulo-sweetmedical">
                <MedicalServices className="icono-sweetmedical"/>
                Sweet Medical
                </h2>
                <p className="presentacion-texto">
                    Accede a tu historial médico, gestiona y agenda turnos con profesionales de la salud en una plataforma centralizada y eficiente.
                </p>
                <Box className="landing-imagen" component="img" src="/images/landing.jpg"/>
                </div>
            {isRegistering ? (
                <RegisterBox onLoginClick={() => setIsRegistering(false)} />
            ) : (
                <LoginBox onRegisterClick={() => setIsRegistering(true)} />
            )}
        </div>

    );
};

export default LoginPage;
