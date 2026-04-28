import React, { useState, useEffect, useRef } from "react";
import CupomTeste from "./CupomPDV";
import ItemCarrinho from "./ItemCarrinho";
import ModalCadastroRapido from "./ModalCadastroRapido";
import ModalPagamento from "./ModalPagamento";
import ModalAutorizacao from "./caixa/ModalAutorizacao";
import CupomPDV from "./CupomPDV.jsx";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function CaixaLojaComponent() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [cpfParaCadastro, setCpfParaCadastro] = useState(null);

  // states para modais (usar estes como fonte única)
  const [pedidoFinalizado, setPedidoFinalizado] = useState(null);
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { usuario } = useAuth();

  const [flashTotal, setFlashTotal] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        setMostrarModalPagamento(true);
        return;
      }
      if (e.key === "F3") {
        e.preventDefault();
        setMostrarModalCadastro(true);
        return;
      }
      if (e.key === "F4") {
        e.preventDefault();
        setShowAuthModal(true);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setResultados([]);
        setBusca("");
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleConfirmarPagamento = async (payload) => {
    try {
      console.log("onConfirm recebido:", payload);

      // 🔥 SE JÁ TEM PEDIDO (PIX), NÃO CHAMA BACKEND DE NOVO
      if (pedidoFinalizado) {
        console.log("⚠️ Pedido já foi criado (PIX), não chamando backend");

        setCarrinho([]);
        setCliente(null);
        setMostrarModalPagamento(false);
        return;
      }

      const itensFormatados = carrinho.map((i) => ({
        produtoId: i.id,
        quantidade: i.quantidade,
        valor: i.price,
      }));

      const response = await api.post(
        "/caixa/finalizar",
        {
          metodoPagamento: payload.metodoPagamento,
          parcelas: payload.parcelas,
          clienteId: cliente?.id || null,
          itens: itensFormatados,
          valorTotal: total,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setPedidoFinalizado(response.data);

      setCarrinho([]);
      setCliente(null);
      setMostrarModalPagamento(false);
    } catch (err) {
      console.error("Erro ao finalizar pagamento:", err.response?.data || err);
    }
  };


  const buscarProduto = async (termo) => {
    if (!termo?.trim()) return;

    const termoLimpo = termo.trim();
    const isCodigoBarras = /^\d{8,}$/.test(termoLimpo);

    try {
      if (isCodigoBarras) {
        const res = await api.get(`/produtos/barcode/${termoLimpo}`);

        if (res.data) {
          adicionarAoCarrinho(res.data);
          return;
        }
      }

      const res = await api.get(
        `/produtos/buscar?termo=${encodeURIComponent(termoLimpo)}`,
      );

      setResultados(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    if (!produto || !produto.id) {
      console.warn("Produto inválido ao adicionar:", produto);
      return;
    }

    setCarrinho((prev) => {
      const existenteIndex = prev.findIndex(
        (p) => String(p.id) === String(produto.id),
      );

      if (existenteIndex !== -1) {
        const novoCarrinho = [...prev];
        novoCarrinho[existenteIndex] = {
          ...novoCarrinho[existenteIndex],
          quantidade: novoCarrinho[existenteIndex].quantidade + 1,
        };
        return novoCarrinho;
      }
      const beep = new Audio("/beep.mp3");
      beep.play();
      return [
        ...prev,
        {
          ...produto,
          quantidade: 1,
        },
      ];
    });

    // Atualiza visor grande sempre com o último produto lido
    setProdutoAtual(produto);
    setTimeout(() => {
      setProdutoAtual(null);
    }, 1200);

    console.log("Adicionando:", produto.id, produto.title);

    // Limpa lista de busca
    setResultados([]);

    // Limpa campo
    setBusca("");

    // Mantém foco no input
    inputRef.current?.focus();
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantidade: Math.max(Number(item.quantidade) + delta, 1),
              }
            : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  };

  const total = Number(
    carrinho
      .reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantidade),
        0,
      )
      .toFixed(2),
  );

  useEffect(() => {
    if (total > 0) {
      setFlashTotal(true);
      const t = setTimeout(() => setFlashTotal(false), 300);
      return () => clearTimeout(t);
    }
  }, [total]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleEnterBuscar = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const lista = await buscarProduto(busca);

      if (lista && lista.length === 1) {
        const produto = lista[0];

        setProdutoAtual(produto);
        adicionarAoCarrinho(produto);

        setResultados([]);
        setBusca("");
      }
    }
  };

  // callback quando cadastro rápido terminar
  const onCadastroSuccess = ({ cliente, modo }) => {
    if (modo === "novo") {
      toast.success("Cliente cadastrado e selecionado");
    } else {
      toast.info("Cliente atualizado e selecionado");
    }

    setCliente(cliente);
    setMostrarModalCadastro(false);
  };

  const removerItem = (id) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const resetCaixa = () => {
    setCarrinho([]);
    setCliente(null);
    setPedidoFinalizado(null);
    setMostrarModalPagamento(false);
  };

  return (
    <div className="h-full grid grid-cols-12 gap-4">
      {/* COLUNA ESQUERDA */}
      <div className="col-span-8 bg-white rounded shadow p-4 flex flex-col">
        {/* PRODUTO ATUAL */}
        {produtoAtual && (
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white shadow-lg rounded-xl p-6 text-center w-96">
              <img
                src={
                  produtoAtual.thumbnail ||
                  (produtoAtual.image?.startsWith?.("http")
                    ? produtoAtual.image
                    : `${API_URL}${produtoAtual.image}`)
                }
                alt={produtoAtual.title}
                className="w-48 h-48 object-contain mx-auto mb-4"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />
              <h2 className="text-xl font-bold">{produtoAtual.title}</h2>
              <p className="text-3xl text-green-600 font-semibold">
                R$ {Number(produtoAtual.price).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* BUSCA + CLIENTE */}
        <div className="flex items-center gap-4">
          <input
            ref={inputRef}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={handleEnterBuscar}
            placeholder="Passe código de barras ou digite o nome..."
            className="flex-1 border rounded p-3 text-lg"
            autoFocus
          />
          {carrinho.length === 0 && !mostrarModalPagamento && (
            <div className="text-center mt-6">
              <div className="text-4xl font-bold text-green-600 animate-pulse">
                🟢 CAIXA LIVRE
              </div>
            </div>
          )}
          <div className="text-right">
            <div className="text-sm text-gray-500">Cliente</div>
            <div className="font-semibold">{cliente ? cliente.nome : "—"}</div>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="mt-4 flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-500 mt-10">Carregando...</div>
          ) : resultados.length > 0 ? (
            resultados.map((p) => (
              <div
                key={p.id}
                className="p-3 border-b hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => adicionarAoCarrinho(p)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.fotoUrl || p.image || "/placeholder.png"}

                    alt={p.title}
                    className="w-22 h-12 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-500">
                      Código: {p.codigoBarras || p.id}
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-purple-700">
                  R$ {Number(p.price).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 mt-10">
              Nenhum resultado
            </div>
          )}
        </div>
      </div>

      {/* COLUNA DIREITA – CARRINHO */}
      <aside className="col-span-4 bg-white rounded shadow p-4 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto max-h-[420px] pr-2">
          {carrinho.length === 0 ? (
            <div className="text-center text-gray-500">
              Nenhum produto adicionado.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600 sticky top-0 bg-white">
                  <th>Produto</th>
                  <th className="text-center">Qtd</th>
                  <th className="text-right">Subtotal</th>
                  <th className="text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((item) => (
                  <ItemCarrinho
                    key={item.id}
                    item={item}
                    alterarQtd={(id, delta) => alterarQuantidade(id, delta)}
                    removerItem={removerItem}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold">Total</div>
            <div
              className={`text-2xl font-bold ${flashTotal ? "text-green-500 scale-110 transition-all" : ""}`}
            >
              R$ {total.toFixed(2)}
            </div>
            {/* <div className="text-2xl font-bold text-purple-800">
              R$ {total.toFixed(2)}
            </div> */}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-semibold"
            >
              F4 – Autorização
            </button>

            <button
              onClick={() => setMostrarModalPagamento(true)}
              className="flex-1 bg-purple-700 text-white px-4 py-3 rounded"
            >
              Pagamento
            </button>

            <button
              type="button"
              onClick={() => {
                setCarrinho([]);
                setCliente(null);
                setMostrarModalPagamento(false);
              }}
              className="flex-1 bg-gray-300 px-4 py-3 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </aside>

      {/* MODAIS */}
      {mostrarModalCadastro && (
        <ModalCadastroRapido
          cpf={cpfParaCadastro}
          onClose={() => setMostrarModalCadastro(false)}
          onSalvar={onCadastroSuccess}
        />
      )}

      {mostrarModalPagamento && (
        <ModalPagamento
          total={total}
          itens={carrinho}
          clienteId={cliente?.id}
          origem="PDV"
          onClose={() => setMostrarModalPagamento(false)}
          onConfirm={handleConfirmarPagamento}
          onFinalizar={resetCaixa} // 🔥 AQUI
        />
      )}

      {pedidoFinalizado && (
        <CupomTeste
          pedido={pedidoFinalizado}
          onClose={() => setPedidoFinalizado(null)}
          onFinalizar={resetCaixa}
        />
      )}

      <ModalAutorizacao
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        operador={usuario}
      />
    </div>
  );
}
