import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RoleRedirector() {
  const { usuario, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname; // ✅ ESSA LINHA É O QUE FALTAVA

  useEffect(() => {
    if (loading) return;
    if (!usuario) return;

    const role = usuario.role;

    // 🔥 usuário tentando acessar área do cliente
    // if (path.startsWith("/produtos")) {
    //   if (role === "CAIXA") {
    //     navigate("/caixa", { replace: true });
    //     return;
    //   }

    //   if (role === "ADMIN" || role === "SUPERUSER") {
    //     navigate("/dashboard", { replace: true });
    //     return;
    //   }
    // }

    // 🔥 redirecionamento da raiz
    if (path === "/") {
      if (role === "ADMIN" || role === "SUPERUSER") {
        navigate("/dashboard", { replace: true });
        return;
      }

      if (role === "CAIXA") {
        navigate("/caixa", { replace: true });
        return;
      }

      navigate("/produtos", { replace: true });
    }
  }, [usuario, loading, path, navigate]);

  return null;
}