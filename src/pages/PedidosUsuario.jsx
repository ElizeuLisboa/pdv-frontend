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
      const response = await api.get(`/pedidos/usuario`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto">
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          className="border border-gray-200 rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition"
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
            <div
              className={`mt-3 md:mt-0 text-sm font-semibold px-4 py-2 rounded-full ${
                pedido.status === "ENTREGUE"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {pedido.status}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
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
                        // `${API_URL}/pedidos/${pedidoId}`
                        : `${API_URL}${item.produto?.image}`
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
                <p className="text-xs text-gray-500">Qtd: {item.quantidade}</p>
                <p className="text-sm font-semibold text-gray-700">
                  R$ {item.produto?.price?.toFixed(2)}
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
  );
}
