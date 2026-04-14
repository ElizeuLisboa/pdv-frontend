import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useEmpresa } from "../contexts/EmpresaContext";

export default function Sidebar({ aberta, onClose }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [empresaNome, setEmpresaNome] = useState(null);
  const { empresaSelecionada } = useEmpresa();
  // const empresaNome = localStorage.getItem("empresaNome");
  const isAdmin = usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER";

  const isAuthenticated = !!usuario;

  useEffect(() => {
    if (!empresaSelecionada) return;

    api
      .get(`/empresas/${empresaSelecionada}`)
      .then((res) => {
        setEmpresaNome(res.data.nome);
      })
      .catch((err) => {
        console.error("Erro ao buscar empresa:", err);
      });
  }, [empresaSelecionada]);

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
  };

  const renderLink = (to, label) => (
    <Link
      to={to}
      onClick={onClose}
      className="block px-3 py-2 rounded-lg hover:bg-gray-800 transition"
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* OVERLAY MOBILE */}
      {aberta && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
      <aside
        className={`
         fixed top-0 left-0 h-full 
         w-64 min-w-[16rem] flex-shrink-0
         bg-gray-900 text-white
         shadow-lg z-50
         transform transition-transform duration-300

        ${aberta ? "translate-x-0" : "-translate-x-full"}

         md:translate-x-0 md:static md:flex md:flex-col
     `}
      >
        {/* Cabeçalho */}
        <div className="p-6 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
          🛍️ Minha Loja
          <button className="md:hidden text-2xl" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
          {usuario?.empresaId && (
            <p className="text-xs text-emerald-400">Empresa: {empresaNome}</p>
          )}
        </div>

        {/* Menu */}
        {/* flex-1 px-4 py-6 space-y-3 text-sm overflow-y-auto" */}
        <nav className="flex-1 px-4 py-6 space-y-3 text-sm overflow-y-auto">
          {renderLink("/produtos", "🧭 Início")}
          {renderLink("/produtos", "🛍️ Produtos")}
          {renderLink("/carrinho", "🛒 Carrinho")}
          {isAuthenticated && renderLink("/pedidos/meus", "📦 Meus Pedidos")}

          {isAdmin && (
            <>
              {renderLink("/clientes", "Clientes")}
              {renderLink("/produtos/novo", "Novo Produto")}
              {renderLink("/transportadoras", "Transportadoras")}
              {renderLink("/dashboard", "Dashboard")}
              {usuario?.role === "SUPERUSER" && (
                <>{renderLink("/empresas", "🏢 Empresas")}</>
              )}
            </>
          )}

          {/* Categorias */}
          <div className="mt-6 border-t border-gray-700 pt-4">
            <p className="text-xs uppercase text-gray-400 mb-2">Categorias</p>

            <ul className="space-y-2">
              <li className="hover:text-emerald-400 cursor-pointer">
                🍬 Doces
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                🍫 Chocolates
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                🥜 Amendoim
              </li>
              <li className="hover:text-emerald-400 cursor-pointer">
                🍬 Balas
              </li>
            </ul>
          </div>
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t border-gray-700">
          {usuario ? (
            <>
              <p className="text-sm mb-2">Olá, {usuario.nome.split(" ")[0]}</p>
              <button
                onClick={handleLogout}
                className="text-sm hover:underline"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm hover:underline">
              Entrar
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
