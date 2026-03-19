import React, { useEffect, useState } from "react";
import api from "../services/api";
import CardProduto from "../components/CardProduto";
import { useFiltro } from "../contexts/FiltroContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Home() {
  const { categoriaSelecionada, busca } = useFiltro();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(location.search);
        const familia = params.get("familia");
        const nome = params.get("nome");

        const { data } = await api.get("/produtos", {
          params: {
            familia: familia || undefined,
            nome: nome || undefined,
          },
        });

        if (!Array.isArray(data)) {
          console.warn("Dados recebidos não são array:", data);
          setProdutos([]);
          return;
        }

        setProdutos(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg animate-pulse">
          Carregando produtos...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {produtos.map((produto) => (
        <CardProduto key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
