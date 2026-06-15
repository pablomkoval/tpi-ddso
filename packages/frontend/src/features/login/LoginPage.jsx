import { Outlet } from "react-router-dom";
import LoginBox from "../../components/loginBox/LoginBox.jsx";
import { MedicalServices } from "@mui/icons-material";
import "./LoginPage.css";

const LoginPage = () => {
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
                </div>
            <LoginBox></LoginBox>
        </div>

    );
};

export default LoginPage;