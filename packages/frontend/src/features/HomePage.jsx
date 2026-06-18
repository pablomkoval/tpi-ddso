import React from "react";
import { Navigate } from "react-router-dom";
import DashboardPaciente from "./DashboardPaciente/DashboardPaciente.jsx";
import DashboardMedico from "./DashboardMedico/DashboardMedico.jsx";
import { getUserRoles } from "../utils/authUtils";

const HomePage = () => {
    const rolesDelCliente = getUserRoles();
    if (!rolesDelCliente) {
        return <Navigate to="/login" replace />;
    }


    const esPaciente = rolesDelCliente.includes("paciente");
    const esMedico = rolesDelCliente.includes("medico");

    // No permitimos ambos roles
    if (esPaciente && esMedico) {
        return <Navigate to="/sin-permiso" replace />;
    }

    if (esPaciente) {
        return <DashboardPaciente />;
    }

    if (esMedico) {
        return <DashboardMedico />;
    }

    return <Navigate to="/sin-permiso" replace />;

};

export default HomePage;