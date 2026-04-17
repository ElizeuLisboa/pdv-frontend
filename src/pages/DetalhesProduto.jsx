import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFiltro } from "../contexts/FiltroContext";
import { formatarPreco } from "../utils/formatarPreco";
import { useCart } from "../contexts/CartContext";
import { Bot } from "lucide-react";
import { produtoCache, isCacheValido } from "../cache/produtoCache";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const DetalhesProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCategoriaSelecionada, setBusca } = useFiltro();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarProduto } = useCart();
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);

  useEffect(() => {
    if (produto?.unidades?.length > 0) {
      setUnidadeSelecionada(produto.unidades[0]);
    }
  }, [produto]);

  useEffect(() => {
    const produtoId = Number(id);

    if (!produtoId || isNaN(produtoId)) {
      setErro("ID inválido do produto.");
      setLoading(false);
      return;
    }

    if (isCacheValido(produtoId)) {
      setProduto(produtoCache[produtoId].data);
      setLoading(false);
      return;
    }

    const fetchProduto = async () => {
      try {
        const res = await api.get(`/produtos/${produtoId}`);
        setProduto(res.data);

        produtoCache[produtoId] = {
          data: res.data,
          timestamp: Date.now(),
        };
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar detalhes do produto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id]);

  const handleQuantidadeChange = (e) => {
    let value = Number(e.target.value);

    if (value < 1) value = 1;

    setQuantidade(value);
  };

  // Função para voltar à página inicial limpando filtros
  const handleVoltarHome = () => {
    setCategoriaSelecionada("");
    setBusca("");
    navigate("/produtos");
  };

  // const handleComprar = async () => {
  //   if (loading) return;
  //   setLoading(true);

  //   try {
  //     adicionarProduto({ ...produto, quantidade });

  //     toast.success(
  //       `${quantidade}x ${produto.nome} adicionado(s) ao carrinho!`,
  //     );

  //     setTimeout(() => navigate("/produtos"), 1000);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Erro ao adicionar produto!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleComprar = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // 🔥 define preço baseado na unidade selecionada
      const precoFinal = unidadeSelecionada?.preco || produto.price || 0;

      // 🔥 define tipo da unidade
      const unidadeFinal = unidadeSelecionada?.tipo || "UN";

      // 🔥 define fator da unidade
      const fatorFinal = unidadeSelecionada?.fator || 1;

      // 🔥 envia corretamente para o carrinho
      adicionarProduto({
        ...produto,
        quantidade,

        // preço correto da unidade escolhida
        price: Number(precoFinal),

        // informações da unidade
        unidade: unidadeFinal,
        fator: Number(fatorFinal),

        // opcional: guardar id da unidade
        unidadeId: unidadeSelecionada?.id || null,
      });

      toast.success(
        `${quantidade}x ${produto.title} (${unidadeFinal}) adicionado(s) ao carrinho!`,
      );

      setTimeout(() => {
        navigate("/produtos");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar produto!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg animate-pulse">
          Carregando detalhes do produto...
        </span>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-red-500 text-lg">{erro}</span>
      </div>
    );
  }

  if (!produto) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded-lg">
      {/* 🔙 VOLTAR */}
      <button
        className="mb-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        onClick={() => navigate("/")}
      >
        Voltar à Página Inicial
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 🖼 IMAGEM + UNIDADES */}
        <div className="flex-1">
          {produto?.image ? (
            <img
              src={
                produto.image.startsWith("http")
                  ? produto.image
                  : `${API_URL}${produto.image}`
              }
              alt={produto.title}
              className="w-full max-h-[400px] object-contain rounded-lg border"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
              Sem imagem
            </div>
          )}

          {/* 🔥 UNIDADES DO PRODUTO */}
          {produto?.unidades?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Escolha a unidade:</h3>

              <div className="space-y-2">
                {produto.unidades.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-3 border rounded p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="unidade"
                      checked={unidadeSelecionada?.id === u.id}
                      onChange={() => setUnidadeSelecionada(u)}
                    />

                    <span className="font-medium">
                      {u.tipo} ({u.fator})
                    </span>

                    <span className="text-amber-600 font-semibold">
                      R$ {Number(u.preco).toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 📦 INFORMAÇÕES */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* TÍTULO */}
            <h1 className="text-2xl font-bold mb-2">{produto?.title || "-"}</h1>

            {/* PREÇO DINÂMICO */}
            <p className="text-2xl text-amber-600 font-bold mb-4">
              R${" "}
              {unidadeSelecionada?.preco
                ? Number(unidadeSelecionada.preco).toFixed(2)
                : produto?.price != null
                  ? Number(produto.price).toFixed(2)
                  : "0,00"}
            </p>

            {/* DESCRIÇÃO */}
            <p className="text-gray-700 mb-4">
              {produto?.description || "Sem descrição disponível"}
            </p>

            {/* CÓDIGO DE BARRAS */}
            {produto?.codigoBarras && (
              <p className="text-sm text-gray-500">
                Código de Barras: {produto.codigoBarras}
              </p>
            )}
          </div>

          {/* 🔢 QUANTIDADE */}
          <div className="mt-6">
            <label
              htmlFor="quantidade"
              className="block text-sm font-medium mb-2"
            >
              Quantidade:
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded"
              >
                -
              </button>

              <input
                id="quantidade"
                type="number"
                min="1"
                value={quantidade}
                onFocus={(e) => e.target.select()}
                onChange={handleQuantidadeChange}
                className="border p-2 w-24 rounded text-center"
              />

              <button
                type="button"
                onClick={() => setQuantidade((q) => q + 1)}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>

          {/* 🛒 BOTÃO COMPRAR */}
          <button
            disabled={loading}
            onClick={handleComprar}
            className={`mt-6 px-6 py-3 rounded text-white font-semibold transition
            ${
              loading
                ? "bg-green-400 cursor-not-allowed opacity-75"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Adicionando..." : "Comprar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesProduto;
