import React from "react";
import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded shadow p-4 m-2 flex flex-col justify-between">
      <h3 className="font-semibold text-lg">{product.title}</h3>
      <p className="text-gray-600 mt-2">Preço: R$ {product.price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Comprar
      </button>
    </div>
  );
}