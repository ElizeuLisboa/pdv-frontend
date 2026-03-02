import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarDrawer from "./SidebarDrawer";
import SelectCategorias from "./SelectCategorias";
import AutoCompleteBusca from "./AutoCompleteBusca";
// import InputBusca from "./InputBusca";
import { useAuth } from "../contexts/AuthContext";
import { useFiltro } from "../contexts/FiltroContext";

export default function Header() {
  const navigate = useNavigate();
  const { usuario, logout, isAutenticado } = useAuth();
  const { categoriaSelecionada, setCategoriaSelecionada, busca, setBusca } =
    useFiltro();

  const [sidebarAberta, setSidebarAberta] = useState(false);

  const handleBuscar = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (categoriaSelecionada) params.append("familia", categoriaSelecionada);

    if (busca) params.append("nome", busca);

    navigate(`/produtos${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <>
      <SidebarDrawer
        aberta={sidebarAberta}
        onClose={() => setSidebarAberta(false)}
      />
      <header className="bg-amber-600 text-white shadow sticky top-0 z-50 w-full px-4 py-2 flex items-center justify-between">
        {/* Logo + Home */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarAberta(true)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
          <img
            src="/LogoRoberta.jpg"
            alt="Minha Loja"
            className="h-10 object-contain"
          />
          <button
            onClick={() => {
              setCategoriaSelecionada("");
              setBusca("");
              navigate("/produtos");
            }}
            className="ml-4 bg-white text-amber-600 px-3 py-1 rounded"
          >
            Página Inicial
          </button>
        </div>

        {/* Busca */}
        <div className="relative flex-1 max-w-2xl mx-4">
          <div className="flex gap-2 items-center w-full">
            <SelectCategorias />
            <AutoCompleteBusca />
          </div>
          {/* <form className="flex gap-2 items-center" onSubmit={handleBuscar}>
            <SelectCategorias />
            <InputBusca />
            <button
              type="submit"
              className="bg-white text-amber-600 px-3 py-1 rounded"
            >
              🔍
            </button>
          </form> */}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isAutenticado ? (
            <>
              <span>
                Olá, {usuario?.nome ? usuario.nome.split(" ")[0] : "Cliente"}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/"); // volta pra home
                }}
                className="ml-2 px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">
              Olá, faça seu login
            </Link>
          )}

          <Link to="/carrinho" className="relative">
            <img
              src="/shopping-cart.png"
              alt="Carrinho"
              className="w-6 h-6 ml-2"
            />
          </Link>
        </div>
      </header>
    </>
  );
}
