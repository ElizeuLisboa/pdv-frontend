import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({
  children,
  roles,
  admin,
  caixa,
}) {
  const { usuario, loading } = useAuth();

  if (loading) return null;

  // 🔒 Não logado
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const role = usuario.role;

  // 🔥 PRIORIDADE 1 → roles explícitos
  if (roles) {
    if (!roles.includes(role)) {
      return <Navigate to="/acesso-negado" replace />;
    }
    return children;
  }

  // 🔥 PRIORIDADE 2 → admin
  if (admin) {
    if (!["ADMIN", "SUPERUSER"].includes(role)) {
      return <Navigate to="/acesso-negado" replace />;
    }
    return children;
  }

  // 🔥 PRIORIDADE 3 → caixa
  if (caixa) {
    if (!["CAIXA", "ADMIN", "SUPERUSER"].includes(role)) {
      return <Navigate to="/acesso-negado" replace />;
    }
    return children;
  }

  // 🔥 DEFAULT → apenas autenticado
  return children;
}