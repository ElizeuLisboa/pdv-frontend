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

  const handleQuantidadeChange = (e) => {
    const valor = parseInt(e.target.value, 10);
    if (!isNaN(valor) && valor >= 1) {
      setQuantidade(valor);
    }
  };

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

  // Função para voltar à página inicial limpando filtros
  const handleVoltarHome = () => {
    setCategoriaSelecionada("");
    setBusca("");
    navigate("/produtos");
  };

  const handleComprar = async () => {
    if (loading) return;
    setLoading(true);

    try {
      adicionarProduto({ ...produto, quantidade });

      toast.success(
        `${quantidade}x ${produto.nome} adicionado(s) ao carrinho!`,
      );

      setTimeout(() => navigate("/produtos"), 1000);
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
      <button
        className="mb-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        onClick={() => navigate("/")}
      >
        Voltar à Página Inicial
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagem do Produto */}
        <div className="flex-1">
          {produto?.image ? (
            <img
              src={
                produto.image.startsWith("http")
                  ? produto.image
                  : `${API_URL}${produto.image}`
              }
              alt={produto.title}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
              Sem imagem
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{produto?.title || "-"}</h1>
            <p className="text-xl text-amber-600 mb-4">
              {produto?.price != null
                ? `R$ ${produto.price.toFixed(2)}`
                : "R$ 0,00"}
            </p>
            <p className="text-gray-700">{produto?.description || "-"}</p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <label htmlFor="quantidade" className="text-sm font-medium">
              Quantidade:
            </label>
            <input
              id="quantidade"
              type="number"
              min="1"
              value={quantidade}
              onChange={handleQuantidadeChange}
              className="border p-1 w-20 rounded text-center"
            />
            {produto?.codigoBarras && (
              <p className="text-sm text-gray-500 mt-2">
                Código de Barras: {produto.codigoBarras}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            onClick={handleComprar}
            className={`mt-4 px-6 py-2 rounded text-white font-semibold transition 
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
