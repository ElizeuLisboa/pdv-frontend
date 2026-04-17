import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import UploadComprovante from "./UploadComprovante";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PedidosUsuario() {
  const { token, usuario } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER";

  const atualizarPedidos = async () => {
    try {
      // `${API_URL}/pedidos/${pedidoId}`
      const response = await api.get(`/pedidos/usuario`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao atualizar pedidos:", error);
    }
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        if (!token) return;

        setLoading(true);

        const jwt = localStorage.getItem("token");

        const { data } = await api.get(
          `/pedidos/${isAdmin ? "todos" : "meus"}`,
          {
            headers: {
              Authorization: jwt ? `Bearer ${jwt}` : "",
            },
          },
        );

        setPedidos(data);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar pedidos.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [token, isAdmin]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  if (pedidos.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        Você ainda não realizou nenhum pedido.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-green-600 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto"></div>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white/95 backdrop-blur rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  Pedido: #{pedido.numeroPedido}
                </p>
                <p className="text-sm text-gray-500">
                  Data:{" "}
                  {pedido.createdAt
                    ? new Date(pedido.createdAt).toLocaleString("pt-BR")
                    : "N/A"}
                </p>
              </div>

              <span
                className={`mt-3 md:mt-0 text-xs font-bold px-3 py-1 rounded-full ${
                  pedido.status === "ENTREGUE"
                    ? "bg-green-500 text-white"
                    : pedido.status === "PAGO"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-400 text-black"
                }`}
              >
                {pedido.status}
              </span>

            </div>
           
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

              {pedido.itens?.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col items-center"
                >
                  <img
                    src={
                      item.produto?.image
                        ? item.produto?.image.startsWith("http")
                          ? item.produto?.image
                          : // `${API_URL}/pedidos/${pedidoId}`
                            `${API_URL}${item.produto?.image}`
                        : "/sem-imagem.png"
                    }
                    alt={item.produto?.title}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />

                  <p className="text-xs font-medium text-center line-clamp-2 mb-1">
                    {item.produto?.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qtd: {item.quantidade}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    R$ {(item.valor * item.quantidade).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {isAdmin ? (
              <UploadComprovante
                pedidoId={pedido.id}
                jaEnviado={pedido.status === "ENTREGUE"}
                onUploaded={() => {
                  setPedidos((prev) =>
                    prev.map((p) =>
                      p.id === pedido.id
                        ? { ...p, status: "ENTREGUE", entregue: true }
                        : p,
                    ),
                  );
                }}
              />
            ) : pedido.status === "ENTREGUE" ? (
              <p className="text-green-700 font-medium">
                ✅ Pedido entregue e comprovante enviado.
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
