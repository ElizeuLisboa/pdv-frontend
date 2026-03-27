import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function PedidoDetalhe() {
  // const { numeroPedido } = useParams();
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchPedido() {
      try {
        console.log("ID NO DETALHE:", id);

        const res = await api.get(`/pedidos/${id}`);
        console.log("RESPOSTA PEDIDO:", res.data);

        setPedido(res.data);
      } catch (err) {
        console.error("Erro ao buscar pedido:", err);
      }
    }

    fetchPedido();
  }, [id]);

  if (!pedido) return <p>Carregando...</p>;

  const statusColor =
    pedido.status === "PAGO"
      ? "text-green-600"
      : pedido.status === "PENDENTE"
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-indigo-900 flex items-center justify-center p-4">
      {/*  */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          🧾 Detalhe do Pedido
        </h1>

        <h2 className="text-lg text-gray-600 mb-4">
          Pedido {pedido.numeroPedido}
        </h2>

        <p className="mb-6">
          <span className="font-semibold">Status:</span>{" "}
          <span className={`font-medium ${statusColor}`}>{pedido.status}</span>
          <span className="mt-2 text-lg font-semibold text-green-700">
          <br />
            Total: R$ {pedido.valorTotal?.toFixed(2)}
          </span>
        </p>

        <div className="space-y-3">
          {pedido.itens.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-lg p-3 bg-gray-50"
            >
              <span className="text-gray-800">{item.produto?.title}</span>

              <span className="text-gray-600">{item.quantidade}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
