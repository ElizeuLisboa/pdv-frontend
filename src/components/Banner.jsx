import React from 'react';

export default function Banner() {
  return (
    <section className="bg-blue-100 text-center py-20 px-4">
      <h2 className="text-4xl font-bold mb-4">Bem-vindo à Minha Loja!</h2>
      <p className="text-lg max-w-xl mx-auto">
        Seu lugar para encontrar produtos incríveis com descontos especiais.
      </p>
      <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
        Ver Produtos
      </button>
    </section>
  );
}
