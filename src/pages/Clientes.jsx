import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Clientes() {
  const { usuario } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token ao buscar clientes:", token);    
        const { data } = await api.get("/clientes", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        setClientes(data);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar os clientes.");
      }
    };

    fetchClientes();
  }, []);



  useEffect(() => {
    const resultado = clientes.filter((cliente) =>
      [cliente.nome, cliente.email, cliente.cpf].some((campo) =>
        campo.toLowerCase().includes(busca.toLowerCase())
      )
    );
    setClientesFiltrados(resultado);
  }, [busca, clientes]);

  const podeEditarExcluir =
    usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER";

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await api.delete(`/clientes/${id}`);
      toast.success("Cliente excluído com sucesso!");
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error("Erro ao excluir cliente");
      console.error("Erro ao excluir cliente:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4 bg-white shadow rounded">
      {/* <h2 className="text-2xl font-bold mb-4">Lista de Clientes</h2> */}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Lista de Clientes</h2>
        <button
          type="button"
          onClick={() =>navigate("/produtos")}
          className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Voltar Pagina Inicial
        </button>

        {(usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER") && (
          <Link
            to="/clientes/novo"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Novo Cliente
          </Link>
        )}
      </div>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nome, email ou CPF"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
        />
        <span className="ml-2 text-gray-500 text-xl">🔍</span>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nome</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">CPF</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Logradouro</th>
            {podeEditarExcluir && <th className="border px-4 py-2">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>
              <td className="border px-4 py-2">{cliente.nome}</td>
              <td className="border px-4 py-2">{cliente.email}</td>
              <td className="border px-4 py-2">{cliente.cpf}</td>
              <td className="border px-4 py-2">{cliente.role}</td>
              <td className="border px-4 py-2">{cliente.logradouro || "-"}</td>
              {podeEditarExcluir && (
                <td className="border px-4 py-2 space-x-2">
                  <Link
                    to={`/clientes/${cliente.id}/editar`} // ✅ rota correta
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Editar
                  </Link>

                  {cliente.role !== "SUPERUSER" && (
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}

          {clientesFiltrados.length === 0 && (
            <tr>
              <td
                colSpan={podeEditarExcluir ? "5" : "4"}
                className="text-center py-4 text-gray-500"
              >
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
