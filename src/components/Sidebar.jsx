// import { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from  "../contexts/AuthContext"; // ajuste o caminho conforme sua estrutura

// export default function Sidebar({ aberta, onClose }) {
//   const { usuario, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const isAdmin = usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER";
//   const isCaixa = usuario?.role === "CAIXA";
//   const isAuthenticated = !!usuario;

//   // 🔸 Sair (diferencia CAIXA dos demais usuários)
//   const handleLogout = () => {
//     if (isCaixa) {
//       // Caixa apenas volta para tela de apresentação (não faz logout)
//       navigate("/apresentacao");
//     } else {
//       // Admins e usuários comuns realmente deslogam
//       logout();
//       navigate("/");
//     }
//     onClose();
//   };

//   const renderLink = (to, label, isEnabled = true) =>
//     isEnabled ? (
//       <Link to={to} className="block hover:underline" onClick={onClose}>
//         {label}
//       </Link>
//     ) : (
//       <span className="block text-white/50 cursor-not-allowed">{label}</span>
//     );

//   return (
//     <aside
//       className={`
//         bg-amber-600 text-white shadow-lg flex flex-col z-50
//         w-64 h-full
//         transition-transform duration-300
//         md:static md:translate-x-0 md:flex
//         fixed top-0 left-0
//         ${aberta ? "translate-x-0" : "-translate-x-full"}
//       `}
//     >
//       {/* Cabeçalho */}
//       <div className="p-6 text-2xl font-bold border-b border-amber-500 flex justify-between items-center">
//         {isCaixa ? "PDV - Caixa" : "Minha Loja"}
//         <button
//           className="md:hidden text-white text-2xl font-bold"
//           onClick={onClose}
//           aria-label="Fechar menu"
//         >
//           &times;
//         </button>
//       </div>

//       {/* Navegação */}
//       <nav className="flex-1 px-4 py-6 space-y-4 text-sm">
//         {/* 🔹 Menu reduzido para o CAIXA */}
//         {isCaixa ? (
//           <>
//             {renderLink("/caixa", "Caixa", true)}
//           </>
//         ) : (
//           <>
//             {renderLink("/carrinho", "Carrinho", true)}
//             {renderLink("/pedidos/meus", "Meus Pedidos", isAuthenticated)}

//             {isAdmin && (
//               <>
//                 {renderLink("/clientes", "Listar Clientes")}
//                 {renderLink("/clientes/novo", "Cadastrar Cliente")}
//                 {renderLink("/produtos/novo", "Cadastrar Produto")}
//                 {renderLink(
//                   "/transportadoras",
//                   "Cadastrar Transportadora"
//                 )}
//                 {renderLink("/caixa-admin", "Gestão do Caixa")}
//                 {renderLink("/dashboard", "Dashboard")}
//               </>
//             )}
//           </>
//         )}
//       </nav>

//       {/* Rodapé */}
//       <div className="p-4 border-t border-amber-500">
//         {usuario ? (
//           <>
//             <p className="text-sm mb-2">Olá, {usuario.nome.split(" ")[0]}</p>
//             <button
//               onClick={handleLogout}
//               className="text-white hover:underline text-sm"
//             >
//               Sair
//             </button>
//           </>
//         ) : (
//           <div>
//             <Link
//               to="/admin"
//               className="hover:underline text-sm"
//               onClick={onClose}
//             >
//               Acesso Administrativo
//             </Link>
//             <br />
//             <Link
//               to="/login"
//               className="hover:underline text-sm"
//               onClick={onClose}
//             >
//               Entrar
//             </Link>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ aberta, onClose }) {
  const { usuario, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const isAdmin =
    usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER";
  const isCaixa = usuario?.role === "CAIXA";
  const isAuthenticated = !!usuario;

  const handleLogout = () => {
    if (isCaixa) {
      navigate("/apresentacao");
    } else {
      logout();
      navigate("/");
    }
    onClose();
  };

  const renderLink = (to, label, isEnabled = true) =>
    isEnabled ? (
      <Link to={to} className="block hover:underline" onClick={onClose}>
        {label}
      </Link>
    ) : (
      <span className="block text-white/50 cursor-not-allowed">{label}</span>
    );

  return (
    <aside
      className={`
        bg-amber-600 text-white shadow-lg flex flex-col z-50
        w-64 h-full
        transition-transform duration-300
        md:static md:translate-x-0 md:flex
        fixed top-0 left-0
        ${aberta ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Cabeçalho */}
      <div className="p-6 text-2xl font-bold border-b border-amber-500 flex justify-between items-center">
        {isCaixa ? "PDV - Caixa" : "Minha Loja"}
        <button
          className="md:hidden text-white text-2xl font-bold"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          &times;
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-4 text-sm">
        {isCaixa ? (
          <>
            {renderLink("/caixa", "Caixa", true)}
          </>
        ) : (
          <>
            {renderLink("/carrinho", "Carrinho", true)}
            {renderLink("/pedidos/meus", "Meus Pedidos", isAuthenticated)}

            {isAdmin && (
              <>
                {renderLink("/clientes", "Listar Clientes")}
                {renderLink("/clientes/novo", "Cadastrar Cliente")}
                {renderLink("/produtos/novo", "Cadastrar Produto")}
                {renderLink("/transportadoras", "Cadastrar Transportadora")}
                {renderLink("/caixa-admin", "Gestão do Caixa")}
                {renderLink("/dashboard", "Dashboard")}
              </>
            )}
          </>
        )}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-amber-500">
        {usuario ? (
          <>
            <p className="text-sm mb-2">
              Olá, {usuario.nome.split(" ")[0]}
            </p>
            <button
              onClick={handleLogout}
              className="text-white hover:underline text-sm"
            >
              Sair
            </button>
          </>
        ) : (
          <div>
            <Link
              to="/login"
              className="hover:underline text-sm"
              onClick={onClose}
            >
              Entrar
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
