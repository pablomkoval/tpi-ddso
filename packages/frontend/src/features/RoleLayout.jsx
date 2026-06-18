import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRoles } from "../utils/authUtils";
import LayoutPaciente from "./LayoutPaciente/LayoutPaciente.jsx";
import LayoutMedico from "./LayoutMedico/LayoutMedico.jsx";

const RoleLayout = () => {
  const rolesDelCliente = getUserRoles();

  if (!rolesDelCliente) {
    return <Navigate to="/login" replace />;
  }

  const esPaciente = rolesDelCliente.includes("paciente");
  const esMedico = rolesDelCliente.includes("medico");

  if (esPaciente && esMedico) {
    return <Navigate to="/sin-permiso" replace />;
  }

  if (esPaciente) {
    return <LayoutPaciente />;
  }

  if (esMedico) {
    return <LayoutMedico />;
  }

  return <Navigate to="/sin-permiso" replace />;

};

export default RoleLayout;