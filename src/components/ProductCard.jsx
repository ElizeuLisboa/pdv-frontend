import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col">
      {/* IMAGEM */}
      <div className="h-40 flex items-center justify-center mb-2">
        <img
          src={product.fotoUrl || product.image || "/placeholder.png"}
          alt={product.title}
          className="max-h-full object-contain"
        />
      </div>

      {/* TITULO */}
      <h3 className="text-sm font-semibold line-clamp-2 min-h-[40px]">
        {product.title}
      </h3>

      {/* PREÇO */}
      <p className="text-lg font-bold text-emerald-600 mt-2">
        R$ {Number(product.price).toFixed(2)}
      </p>

      {/* DESCRIÇÃO OPCIONAL */}
      {product.description && (
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* BOTÃO */}
      <button
        onClick={() => onAddToCart(product)}
        className="mt-auto bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition text-sm"
      >
        🛒 Adicionar
      </button>
    </div>
  );
}
