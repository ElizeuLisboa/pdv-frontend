import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ aberta, onClose }) {
  const { usuario, logout, loading } = useAuth();
  const navigate = useNavigate();

  // if (loading) return null;

  const isAdmin = usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER";
  const isCaixa = usuario?.role === "CAIXA";
  const isAuthenticated = !!usuario;

  console.log("USUARIO SIDEBAR:", usuario);

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
    <>
      {/* 🔥 OVERLAY MOBILE */}
      {aberta && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        bg-gray-900 text-white shadow-lg flex flex-col z-50
        w-64 h-full
        transition-transform duration-300
        md:static md:translate-x-0 md:flex
        fixed top-0 left-0
        ${aberta ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Cabeçalho */}
        <div className="p-6 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
          {isCaixa ? "🧾 PDV" : "🛍️ Minha Loja"}
          <button className="md:hidden text-white text-2xl" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-4 text-sm">
          {isCaixa ? (
            <>{renderLink("/caixa", "Caixa")}</>
          ) : (
            <>
              {renderLink("/", "🏠 Início")}
              {renderLink("/produtos", "🛍️ Produtos")}
              {renderLink("/carrinho", "🛒 Carrinho")}
              {renderLink("/pedidos/meus", "📦 Meus Pedidos", isAuthenticated)}

              {/* 🔥 ADMIN */}
              {isAdmin && (
                <>
                  {renderLink("/clientes", "Clientes")}
                  {renderLink("/produtos/novo", "Novo Produto")}
                  {renderLink("/transportadoras", "Transportadoras")} 
                  {renderLink("/dashboard", "Dashboard")}
                </>
              )}

              {/* 🔥 CATEGORIAS */}
              <div className="mt-6 border-t border-gray-700 pt-4">
                <p className="text-xs uppercase text-gray-400 mb-2">
                  Categorias
                </p>

                <ul className="space-y-2 text-sm">
                  <li className="cursor-pointer hover:text-emerald-400">
                    🍬 Doces
                  </li>
                  <li className="cursor-pointer hover:text-emerald-400">
                    🍫 Chocolates
                  </li>
                  <li className="cursor-pointer hover:text-emerald-400">
                    🥜 Amendoim
                  </li>
                </ul>
              </div>
            </>
          )}
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t border-gray-700">
          {usuario ? (
            <>
              <p className="text-sm mb-2">Olá, {usuario.nome.split(" ")[0]}</p>
              <button
                onClick={handleLogout}
                className="hover:underline text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="hover:underline text-sm"
            >
              Entrar
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
