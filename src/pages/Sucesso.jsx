import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFiltro } from "../contexts/FiltroContext";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Sucesso() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get("external_reference");
  const status = searchParams.get("status");

  const { familiaSelecionada, busca } = useFiltro();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  console.log("ID DO PEDIDO:", pedidoId);

  useEffect(() => {
    if (!pedidoId) {
      toast.error("Pedido inválido.");
      setLoading(false);
      return;
    }

    const fetchPedido = async (tentativa = 1) => {
      try {
        const response = await api.get(`/pedidos/${pedidoId}`);

        if (!response.data?.numeroPedido) {
          if (tentativa <= 5) {
            setTimeout(() => fetchPedido(tentativa + 1), 2000);
            return;
          }

          toast.error("Pedido não encontrado.");
          setLoading(false);
          return;
        }

        setPedido(response.data);
        setLoading(false);
      } catch (err) {
        if (tentativa <= 5) {
          setTimeout(() => fetchPedido(tentativa + 1), 2000);
        } else {
          toast.error("Erro ao recuperar o pedido.");
          setLoading(false);
        }
      }
    };

    fetchPedido();
  }, [pedidoId, API_URL]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Confirmando seu pedido...
        </h2>
        <p>Estamos validando as informações do pagamento.</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl text-red-600 font-semibold">
          Não foi possível carregar o pedido.
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded"
        >
          Voltar para loja
        </button>
      </div>
    );
  }

  const aprovado = status === "approved";

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* CABEÇALHO */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {aprovado
            ? "🎉 Compra realizada com sucesso!"
            : "⏳ Pagamento em processamento"}
        </h2>

        <p className="text-gray-600 mt-2">
          Pedido nº <strong>{pedido.numeroPedido}</strong>
        </p>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="border rounded p-4 shadow-sm bg-white">
        <div className="mb-4">
          <p>
            <strong>Status:</strong> {aprovado ? "Aprovado" : status}
          </p>

          <p>
            <strong>Valor total:</strong> R${" "}
            {(pedido.valorTotal ?? 0).toFixed(2)}
          </p>
        </div>

        {pedido.itens?.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Itens do pedido</h3>

            <ul className="divide-y">
              {pedido.itens.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span>
                    {item.produto?.title || "Produto"}
                    {" – "}
                    {item.quantidade}x
                  </span>

                  <span>R$ {(item.valor ?? 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* AÇÕES */}
      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => navigate("/pedidos/meus")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver meus pedidos
        </button>

        <button onClick={() => navigate(`/pedido/${pedidoId}`)}>
          Ver detalhes do pedido
        </button>
      </div>
    </div>
  );
}

/*
id: 1326745320
external_reference: "60"
status: "pending" */
