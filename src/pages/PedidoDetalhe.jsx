import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function PedidoDetalhe() {
  const { numeroPedido } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    async function fetchPedido() {
      const res = await api.get(`/pedidos/${numeroPedido}`);
      setPedido(res.data);
    }

    fetchPedido();
  }, []);

  if (!pedido) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Pedido {pedido.numeroPedido}</h1>
      <p>Status: {pedido.status}</p>

      {pedido.itens.map((item) => (
        <div key={item.id}>
          {item.produto.nome} - {item.quantidade}x
        </div>
      ))}
    </div>
  );
}