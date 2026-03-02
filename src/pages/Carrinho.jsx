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

  // 🔢 total do carrinho
  const total = (cartItems || []).reduce(
    (acc, item) => acc + item.price * (item.quantidade ?? item.quantity ?? 1),
    0,
  );

  const finalizarCompra = async () => {
    try {
      // 🔐 1) BLOQUEIO SE NÃO ESTIVER LOGADO
      if (!usuario) {
        toast.info("Você precisa fazer login para continuar");
        navigate("/login", { state: { voltarParaCheckout: true } });
        return;
      }

      const itensFormatados = cartItems.map((item) => ({
        produtoId: item.id ?? item.produtoId,
        quantidade: item.quantidade ?? item.quantity ?? 1,
        valor: item.price,
      }));

      console.log("itensFormatados:", itensFormatados);

      // 2️⃣ cria pedido no backend (já vai com JWT pelo api.js)
      const pedidoRes = await api.post("/pedidos/site", {
        itens: itensFormatados,
        valorTotal: total,
      });

      const pedidoId = pedidoRes.data?.pedido?.id;

      if (!pedidoId) {
        toast.error("Erro ao criar pedido");
        return;
      }

      // 3️⃣ salva pedido para o pagamento usar
      localStorage.setItem("pedidoId", pedidoId);

      // 4️⃣ abre modal de pagamento
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
    <div className="carrinho-container">
      <h2 className="text-2xl font-bold mb-4">Carrinho</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="carrinho-lista">
            {cartItems.map((item) => (
              <li key={item.id} className="carrinho-item">
                <img src={item.image} alt={item.title} width={60} />
                <div className="flex align-middle gap-4 ml-4">
                  <strong>{item.title}</strong>
                  <strong>
                    <p>Quantidade: {item.quantidade ?? item.quantity ?? 1}</p>
                  </strong>
                  <strong>
                    <p>Preço: R$ {item.price.toFixed(2)}</p>
                  </strong>
                  <strong>
                    <h3>Total: R$ {total.toFixed(2)}</h3>
                  </strong>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-end gap-3">
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Esvaziar Carrinho
            </button>

            <button
              onClick={() => setMostrarPix(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Pagar com PIX
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={finalizarCompra}
            >
              Finalizar Compra MP
            </button>
          </div>
        </>
      )}

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
