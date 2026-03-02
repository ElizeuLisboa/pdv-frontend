import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireRole({ roles, children }) {
  const { usuario } = useAuth();

  // segurança extra
  if (!usuario) return null;

  if (!roles.includes(usuario.role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
}
