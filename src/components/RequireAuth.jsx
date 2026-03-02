import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({
  children,
  roles,
  admin,
  caixa,
}) {
  const { usuario, loading } = useAuth();

  if (loading) return null;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const role = usuario.role;

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  if (admin && !["ADMIN", "SUPERUSER"].includes(role)) {
    return <Navigate to="/" replace />;
  }

  if (caixa && !["CAIXA", "ADMIN", "SUPERUSER"].includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
