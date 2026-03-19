import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CardProduto from "../components/CardProduto";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Produtos() {
  const location = useLocation();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const familia = params.get("familia") || "";
    const nome = params.get("nome") || "";

    setLoading(true);

    api
      .get("/produtos", {
        params: {
          ...(familia && { familia }),
          ...(nome && { nome }),
        },
      })
      .then((res) => {
        const data = res.data;

        if (!Array.isArray(data)) {
          console.warn("Dados recebidos não são array:", data);
          setProdutos([]);
          return;
        }

        const produtosValidos = data.filter((p) => p && p.image);
        setProdutos(produtosValidos);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setProdutos([]);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  if (!produtos.length) {
    return <p>Nenhum produto encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {produtos.map((produto) => (
        <CardProduto key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
