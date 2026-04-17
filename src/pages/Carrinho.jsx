import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import MercadoPagoCardPayment from "../components/MercadoPagoCardPayment";

const Carrinho = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const { usuario } = useAuth();
  const [mostrarPix, setMostrarPix] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [pagamentoAtivo, setPagamentoAtivo] = useState(false);
  const [statusPagamento, setStatusPagamento] = useState("PENDENTE");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (!pixData) return;

    const interval = setInterval(async () => {
      try {
        const pedidoId = localStorage.getItem("pedidoId");

        const res = await api.get(`/pedidos/${pedidoId}`);

        if (res.data.status === "PAGO") {
          clearInterval(interval);

          window.location.href = `/sucesso?external_reference=${pedidoId}&status=approved`;
        }
      } catch (err) {
        console.error("Erro ao verificar status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pixData]);

  const total = (cartItems || []).reduce(
    (acc, item) => acc + item.price * (item.quantidade ?? item.quantity ?? 1),
    0,
  );

  const copiarPix = async () => {
    const codigo = pixData.point_of_interaction.transaction_data.qr_code;

    await navigator.clipboard.writeText(codigo);

    setCopiado(true);

    setTimeout(() => setCopiado(false), 2000);
  };

  const finalizarCompra = async () => {
    try {
      if (!usuario && !loading) {
        toast.info("Você precisa fazer login para continuar");
        navigate("/login", { state: { voltarParaCheckout: true } });
        return;
      }

      const itensFormatados = cartItems.map((item) => ({
        produtoId: item.id ?? item.produtoId,
        quantidade: item.quantidade ?? item.quantity ?? 1,
        preco: item.price,
      }));

      const token = localStorage.getItem("token");

      const pedidoRes = await api.post(
        "/pedidos/site",
        {
          itens: itensFormatados,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const pedidoId = pedidoRes.data?.id;

      console.log("PEDIDO ID:", pedidoId);

      if (!pedidoId) {
        toast.error("Erro ao criar pedido");
        return;
      }

      localStorage.setItem("pedidoId", pedidoId);

      setInterval(() => {
        verificarStatusPedido();
      }, 5000);

      setMostrarPagamento(true);
    } catch (err) {
      console.error("Erro ao finalizar:", err);

      if (err.response?.status === 401) {
        toast.info("Sessão expirada. Faça login novamente.");
        navigate("/login");
        return;
      }

      toast.error("Erro ao criar pedido");
    }
  };

  const pagarComPix = async () => {
    setPagamentoAtivo(true);
    try {
      const pedidoId = localStorage.getItem("pedidoId");

      const res = await api.post("/pagamentos/pix", {
        pedidoId: Number(pedidoId),
      });

      console.log("PIX RESPONSE:", res.data);

      setPixData(res.data);
    } catch (err) {
      console.error("Erro PIX:", err);
    }
  };

  const verificarPagamento = async () => {
    try {
      const pedidoId = localStorage.getItem("pedidoId");

      if (!pedidoId) return;

      const res = await api.get(`/pedidos/${pedidoId}`);

      if (res.data.status === "PAGO") {
        setStatusPagamento("PAGO");

        setModal({ mensagem: "Pagamento confirmado!", tipo: "sucesso" });

        setTimeout(() => {
          setModal(null);
          window.location.href = `/sucesso?external_reference=${pedidoId}&status=approved`;
        }, 2000);

        // 👉 vai para sucesso (igual cartão)
        window.location.href = `/sucesso?external_reference=${pedidoId}&status=approved`;
      } else {
        toast.info("Pagamento ainda não identificado.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ModalFeedback = ({ mensagem, tipo }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className={`px-6 py-4 rounded-xl shadow-xl text-white text-center text-lg
        ${tipo === "sucesso" ? "bg-green-600" : "bg-red-500"}`}
        >
          {mensagem}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-500 to-blue-900 flex items-center justify-center p-20">
      <div className="w-full max-w-6xl bg-gradient-to-br from-indigo-500 to-green-900 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">🛒 Carrinho</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Seu carrinho está vazio.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* 🟢 LISTA DE PRODUTOS */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const quantidade = item.quantidade ?? item.quantity ?? 1;
                const subtotal = item.price * quantidade;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white p-4 rounded shadow"
                  >
                    {/* IMAGEM */}
                    <img
                      src={item.fotoUrl || item.image || "/placeholder.png"}
                      alt={item.title}
                      className="w-20 h-20 object-contain"
                    />

                    {/* INFO */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>

                      <p className="text-sm text-gray-500">
                        Quantidade: {quantidade}
                      </p>

                      <p className="text-sm text-gray-500">
                        Unitário: R$ {item.price.toFixed(2)}
                      </p>

                      <p className="text-emerald-600 font-bold mt-1">
                        Subtotal: R$ {subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🟡 RESUMO */}
            <div className="bg-white p-4 rounded shadow h-fit">
              <h3 className="text-lg font-semibold mb-4">Resumo</h3>

              <div className="flex justify-between mb-2">
                <span>Total</span>
                <span className="font-bold text-emerald-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              {/* 🔥 FRETE (SIMULADO) */}
              <div className="text-sm text-gray-500 mb-4">
                🚚 Frete grátis acima de R$ 200
              </div>
              <div className="flex flex-col gap-2">
                {/* 💳 MERCADO PAGO */}
                <button
                  onClick={finalizarCompra}
                  disabled={pagamentoAtivo}
                  className={`${
                    pagamentoAtivo ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  💳 Pagar com Cartão
                </button>

                {/* 🔥 PIX */}

                <button
                  onClick={pagarComPix}
                  disabled={pagamentoAtivo}
                  className={`bg-green-600 text-white px-4 py-2 rounded ${
                    pagamentoAtivo
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-700"
                  }`}
                >
                  💚 Pagar com PIX
                </button>

                {/* 🧹 LIMPAR */}
                <button
                  onClick={clearCart}
                  disabled={pagamentoAtivo}
                  className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Esvaziar Carrinho
                </button>
                {pixData && (
                  <button
                    onClick={verificarPagamento}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    ✅ Já paguei
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* 💳 MODAL PAGAMENTO */}
        {mostrarPagamento && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-xl w-full max-w-lg">
              <MercadoPagoCardPayment
                valor={total}
                onClose={() => setMostrarPagamento(false)}
              />
            </div>
          </div>
        )}
        {/* 🔥 PIX (AQUI QUE ENTRA) */}
        {pixData && (
          <div className="mt-6 bg-white p-6 rounded-2xl shadow-xl text-center max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              💚 Pagamento via PIX
            </h2>

            <p className="text-gray-500 text-sm mb-4">
              Escaneie o QR Code ou copie a chave abaixo
            </p>

            {/* QR CODE */}
            <div className="bg-gray-100 p-4 rounded-xl inline-block">
              <img
                src={`data:image/png;base64,${pixData.point_of_interaction.transaction_data.qr_code_base64}`}
                alt="QR Code"
                className="w-56 h-56 object-contain mx-auto"
              />
            </div>

            {/* STATUS */}
            <p className="mt-4 text-yellow-600 font-semibold animate-pulse">
              ⏳ Aguardando pagamento...
            </p>

            {/* CÓDIGO PIX */}
            <div className="mt-4 bg-gray-100 p-3 rounded text-xs break-all">
              {pixData.point_of_interaction.transaction_data.qr_code}
            </div>

            {/* BOTÃO COPIAR */}

            <button
              onClick={() => {
                // navigator.clipboard.writeText(copiaECola);
                navigator.clipboard.writeText(
                  pixData.point_of_interaction.transaction_data.qr_code,
                );
                toast.info("Código PIX copiado!");
              }}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
              📋 Copiar código PIX
            </button>

            <p className="text-sm text-gray-600 mt-2">
              Abra o app do seu banco, escolha pagar com PIX e escaneie o QR
              Code ou cole o código copiado.
            </p>
          </div>
        )}{" "}
        {modal && <ModalFeedback mensagem={modal.mensagem} tipo={modal.tipo} />}
      </div>
    </div>
  );
};

export default Carrinho;
