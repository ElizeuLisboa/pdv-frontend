// src/pages/AcessoNegado.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AcessoNegado() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-red-600">Acesso Negado</h1>
      <p className="mb-6 text-lg text-gray-700">
        Você não tem permissão para acessar esta página.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}
