import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { formatarPreco } from "../utils/formatarPreco";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function CardProduto({ produto }) {
  const navigate = useNavigate();
  const { adicionarProduto } = useContext(CartContext);

  if (!produto) {
    // Caso produto esteja indefinido, renderiza um placeholder
    return (
      <div className="border p-4 rounded shadow flex flex-col">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
          Produto indisponível
        </div>
      </div>
    );
  }

  const imageUrl = produto?.image || "/placeholder.png";
  const title = produto?.title || "Produto sem título";
  const price = produto?.price ?? 0; // Se price for undefined, mostra 0

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
      <img
        src={produto.fotoUrl || produto.image}
        alt={produto.title}
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* <img
        src={
          produto.image.startsWith("http")
            ? produto.image
            : `${API_URL}${produto.image}`
        }
        alt={produto.title}
      /> */}

      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-amber-600 mb-2">{formatarPreco(price)}</p>
      <div className="mt-auto flex gap-2">
        <button
          onClick={() => navigate(`/produtos/${produto.id}`)}
          className="flex-1 bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700"
        >
          Ver
        </button>
      </div>
    </div>
  );
}
