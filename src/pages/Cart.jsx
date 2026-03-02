import React from 'react';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Carrinho de Compras</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between border p-4 rounded">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                </div>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => removeFromCart(index)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>  

          <div className="text-right mt-6">
            <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </main>
  );
}
