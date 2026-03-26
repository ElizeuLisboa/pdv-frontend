import React, { useState } from "react";
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

  const total = (cartItems || []).reduce(
    (acc, item) => acc + item.price * (item.quantidade ?? item.quantity ?? 1),
    0,
  );

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
        valor: item.price,
      }));

      const token = localStorage.getItem("token");
      console.log("TOKEN LIMPO:", token);

      const pedidoRes = await api.post(
        "/pedidos/site",
        {
          itens: itensFormatados,
          valorTotal: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // const pedidoId = pedidoRes.data?.pedido?.id;
     const pedidoId = pedidoRes.data?.pedido?.id;
                   // pedidoRes.data?.pedido?.id

      console.log("RESPOSTA BACK:", pedidoRes.data);
      console.log("PEDIDO ID:", pedidoRes.data?.pedidoId);

      if (!pedidoId) {
        toast.error("Erro ao criar pedido");
        return;
      }

      localStorage.setItem("pedidoId", pedidoId);

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

  return (
    <div className="max-w-6xl mx-auto p-4">
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
              {/* 🔥 PIX */}
              <button
                onClick={() => setMostrarPix(true)}
                className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Pagar com PIX
              </button>

              {/* 💳 MERCADO PAGO */}
              <button
                onClick={finalizarCompra}
                className="bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
              >
                Finalizar Compra (Cartão)
              </button>

              {/* 🧹 LIMPAR */}
              <button
                onClick={clearCart}
                className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Esvaziar Carrinho
              </button>
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
    </div>
  );
};

export default Carrinho;
