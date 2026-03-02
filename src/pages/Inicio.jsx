import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo à Minha Loja</h1>
      <p className="mb-4">Você já tem uma conta?</p>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sim, fazer login
        </button>
        <button
          onClick={() => navigate('/cadastro')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Não, quero me cadastrar
        </button>
      </div>
    </div>
  );
}
