// components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function PrivateRoute({ rolesPermitidos, children }) {
  const { usuario, loading } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;

  if (!usuario) return <Navigate to="/login" replace />;

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}

