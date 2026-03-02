import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function FullScreenRoute({ children, rolesPermitidos = [] }) {
const { usuario } = useAuth();


if (!usuario) return <Navigate to="/login" replace />;


if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario.role)) {
return <Navigate to="/" replace />;
}


return children;
}