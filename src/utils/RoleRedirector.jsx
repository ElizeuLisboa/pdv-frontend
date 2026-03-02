// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// /**
//  * Componente responsável por redirecionar o usuário
//  * com base no papel (role), sem quebrar o app no boot.
//  *
//  * IMPORTANTE:
//  * - Nunca destrutura AuthContext direto
//  * - Sempre respeita o loading
//  */
// export function RoleRedirector() {
//   const { usuario, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   if (loading || !usuario) return null;

//   useEffect(() => {
//     // Ainda carregando auth (localStorage, etc)
//     if (loading) return;

//     // Usuário não logado → não faz nada
//     if (!usuario) return;

//     const role = usuario.role;

//     // Se já estiver em alguma rota do sistema, não força redirect
//     if (location.pathname !== "/") return;

//     // Redirecionamento por role
//     if (role === "ADMIN" || role === "SUPERUSER") {
//       navigate("/dashboard", { replace: true });
//       return;
//     }

//     if (role === "CAIXA") {
//       navigate("/caixa", { replace: true });
//       return;
//     }

//     // Usuário comum
//     navigate("/produtos", { replace: true });
//   }, [usuario, loading, location.pathname, navigate]);

//   // Não renderiza nada
//   return null;
// }

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RoleRedirector() {
  const { usuario, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!usuario) return;
    if (location.pathname !== "/") return;

    const role = usuario.role;

    if (role === "ADMIN" || role === "SUPERUSER") {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (role === "CAIXA") {
      navigate("/caixa", { replace: true });
      return;
    }

    navigate("/produtos", { replace: true });
  }, [usuario, loading, location.pathname, navigate]);

  return null;
}
