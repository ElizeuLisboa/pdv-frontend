import React, { useEffect, useState } from "react";
import api from "../services/api";
import CarrosselProdutos from "../components/CarrosselProdutos";
import { useFiltro } from "../contexts/FiltroContext";
import { useEmpresa } from "../contexts/EmpresaContext";

export default function Home() {
  const { categoriaSelecionada, busca } = useFiltro();
  const { empresaSelecionada } = useEmpresa();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresaSelecionada) {
      console.log("⚠️ Setando empresa padrão");
      localStorage.setItem("empresaSelecionada", 1);
      window.location.reload(); // simples e resolve
    }
  }, []);

  // 🔥 BUSCAR PRODUTOS

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);

        console.log("🔎 FILTROS:", {
          empresaSelecionada,
          categoriaSelecionada,
          busca,
        });

        const { data } = await api.get("/produtos", {
          params: {
            familia: categoriaSelecionada || undefined,
            nome: busca || undefined,
          },
        });

        setProdutos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [empresaSelecionada, categoriaSelecionada, busca]);

  // 🔥 BUSCAR CATEGORIAS
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await api.get("/produtos/categorias");
        setCategorias(data || []);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      }
    };

    fetchCategorias();
  }, []);

  // 🔥 AGORA SIM PODE TER IF
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg animate-pulse">
          Carregando produtos...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 🔥 BANNER */}

      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6 text-center shadow-sm">
        <p className="font-semibold text-lg">
          ⚠️ Plataforma em fase final de implantação
        </p>

        <p className="text-sm mt-1">
          Algumas funcionalidades podem passar por ajustes para melhor
          atendê-lo. Agradecemos sua confiança e compreensão 💚
        </p>
      </div>

      <div className="bg-emerald-600 text-white p-4 rounded mb-6 text-center font-semibold">
        🚚 Frete grátis acima de R$ 200 • 💳 Até 4x sem juros
      </div>

      {/* 🔥 MAIS VENDIDOS */}
      <h2 className="text-xl font-bold mb-2">🔥 Mais Vendidos</h2>
      <CarrosselProdutos produtos={produtos.slice(0, 10)} />

      {/* 🔥 CATEGORIAS DINÂMICAS */}
      {categorias.map((cat) => {
        const produtosCategoria = produtos.filter(
          (p) => p.categoriaId === cat.id,
        );

        if (produtosCategoria.length === 0) return null;

        return (
          <div key={cat.id}>
            <h2 className="text-xl font-bold mt-6 mb-2">{cat.nome}</h2>

            <CarrosselProdutos produtos={produtosCategoria} />
          </div>
        );
      })}
    </div>
  );
}
