import React from "react";
import { useNavigate } from "react-router-dom";

export default function Apresentacao() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-100 to-amber-300">
      <img
        src="/apresentacao.png"
        alt="Apresentação"
        className="w-48 h-48 object-contain mb-6"
      />
      <h1 className="text-3xl font-bold text-amber-800 mb-4">
        Bem-vindo à Loja Roberta
      </h1>
      <button
        onClick={() => navigate("/login")}
        className="bg-amber-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-amber-700 transition"
      >
        Entrar no Caixa
      </button>
    </div>
  );
}
