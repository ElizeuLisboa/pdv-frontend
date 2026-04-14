import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SelectCategorias from "./SelectCategorias";
import AutoCompleteBusca from "./AutoCompleteBusca";
import { useFiltro } from "../contexts/FiltroContext";
import { useEffect, useState } from "react";
import { useEmpresa } from "../contexts/EmpresaContext";
import { setEmpresaSelecionadaGlobal } from "../services/empresaStore";

import api from "../services/api";

export default function Header({ abrirSidebar }) {
  const navigate = useNavigate();
  const { usuario, logout, isAutenticado } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const { categoriaSelecionada, setCategoriaSelecionada, busca, setBusca } =
    useFiltro();
  const { empresaSelecionada, setEmpresaSelecionada } = useEmpresa();
 
  useEffect(() => {
    const saved = localStorage.getItem("empresaSelecionada");

    if (saved) {
      setEmpresaSelecionada(Number(saved));
    }
  }, []);

  useEffect(() => {
    if (empresaSelecionada) {
      localStorage.setItem("empresaSelecionada", empresaSelecionada);
    }
  }, [empresaSelecionada]);

  useEffect(() => {
    async function carregarEmpresas() {
      try {
        const res = await api.get("/empresas"); // 👈 endpoint
        setEmpresas(res.data);
      } catch (err) {
        console.error("Erro ao carregar empresas", err);
      }
    }

    carregarEmpresas();
  }, []);
  console.log("Empresas carregadas:", empresas);

  const handleBuscar = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (categoriaSelecionada) params.append("familia", categoriaSelecionada);
    if (busca) params.append("nome", busca);

    navigate(`/produtos${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <header className="bg-gray-900 text-white shadow sticky top-0 z-50 w-full px-4 py-2 flex items-center justify-between">
      {/* ESQUERDA */}
      <div className="flex items-center gap-3">
        <button onClick={abrirSidebar} className="text-2xl md:hidden">
          ☰
        </button>

        <img src="/LogoRoberta.jpg" className="h-10" />

        <button
          onClick={() => {
            setCategoriaSelecionada("");
            setBusca("");
            navigate("/produtos");
          }}
          className="bg-emerald-600 px-3 py-1 rounded text-sm"
        >
          Início
        </button>
      </div>

      {/* BUSCA */}
      <form
        onSubmit={handleBuscar}
        className="hidden md:flex flex-1 max-w-2xl mx-4 gap-2"
      >
        <SelectCategorias />
        <AutoCompleteBusca />
        <button className="bg-emerald-600 px-3 py-1 rounded">🔍</button>
      </form>

      {/* DIREITA */}
      <div className="flex items-center gap-4 text-sm">
        {isAutenticado ? (
          <>
            <span className="hidden sm:block">
              Olá, {usuario?.nome?.split(" ")[0]}
            </span>

            {usuario?.role === "SUPERUSER" && (
              <select
                value={empresaSelecionada || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);

                  setEmpresaSelecionada(id); // React (UI)
                  setEmpresaSelecionadaGlobal(id); // Interceptor (API)
                }}
                className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
              >
                <option value="">Selecionar empresa</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 px-2 py-1 rounded text-xs"
            >
              Sair
            </button>
          </>
        ) : (
          <Link to="/login">Entrar</Link>
        )}

        <Link to="/carrinho">
          <img src="/shopping-cart.png" className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
