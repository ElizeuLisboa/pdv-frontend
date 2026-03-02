import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminPage() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    } else if (usuario.role !== "SUPERUSER") {
      navigate("/");
    }
  }, [usuario, navigate]);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <p className="mb-6">Bem-vindo(a), {usuario?.nome}!</p>

      <div className="space-y-4">
        <p>
          <strong>Acesso:</strong> Você tem permissões elevadas como <code>SUPERUSER</code>.
        </p>
        <p>Você pode realizar as seguintes ações:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="/clientes" className="text-blue-600 hover:underline">Listar Clientes</a></li>
          <li><a href="/clientes/novo" className="text-blue-600 hover:underline">Cadastrar Cliente</a></li>
          <li><a href="/produtos/novo" className="text-blue-600 hover:underline">Cadastrar Produto</a></li>
        </ul>
      </div>
    </div>
  );
}
