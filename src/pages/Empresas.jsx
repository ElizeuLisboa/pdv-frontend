import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
  });

  const [editando, setEditando] = useState(null);

  async function carregarEmpresas() {
    try {
      const res = await api.get("/empresas");
      setEmpresas(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    carregarEmpresas();
  }, []);

  localStorage.setItem("empresaId", empresas.id);
  localStorage.setItem("empresaNome", empresas.nome);

  // 🔹 Criar ou editar
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editando) {
        await api.patch(`/empresas/${editando.id}`, form);
        toast.success("Empresa atualizada");
      } else {
        await api.post("/empresas", form);
        toast.success("Empresa criada");
      }

      setForm({
        nome: "",
        cnpj: "",
        endereco: "",
        telefone: "",
      });

      setEditando(null);
      carregarEmpresas();
    } catch (err) {
      toast.error("Erro ao salvar empresa");
    }
  }

  // 🔹 Toggle (bloquear/ativar)
  async function handleToggle(empresa) {
    try {
      await api.patch(`/empresas/${empresa.id}/toggle`, {
        ativa: empresa.ativa,
      });

      toast.success(empresa.ativa ? "Empresa bloqueada" : "Empresa ativada");

      carregarEmpresas();
    } catch (err) {
      toast.error("Erro ao atualizar empresa");
    }
  }

  // 🔹 Editar
  function handleEditar(emp) {
    setEditando(emp);
    setForm({
      nome: emp.nome || "",
      cnpj: emp.cnpj || "",
      endereco: emp.endereco || "",
      telefone: emp.telefone || "",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-green-200 p-6">
      <div className="max-w-5xl mx-auto bg-gradient-to-tl from-cyan-300 via-zinc-900 via-50% to-green-500 text-white p-6 rounded-2xl shadow-2xl space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">🏢 Empresas</h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-800 transition px-4 py-2 rounded shadow"
          >
            ⬅️ Voltar
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
        >
          {editando && (
            <p className="text-sm text-yellow-300">
              ✏️ Editando: {editando.nome}
            </p>
          )}

          <input
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="p-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            placeholder="CNPJ"
            value={form.cnpj}
            onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
            className="p-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            placeholder="Endereço"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            className="p-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <input
            placeholder="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            className="p-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <div className="flex gap-2">
            <button className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 px-4 py-2 rounded shadow-md">
              {editando ? "Atualizar Empresa" : "Criar Empresa"}
            </button>

            {editando && (
              <button
                type="button"
                onClick={() => {
                  setEditando(null);
                  setForm({
                    nome: "",
                    cnpj: "",
                    endereco: "",
                    telefone: "",
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 transition px-4 py-2 rounded"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* LISTA */}
        <div className="space-y-3">
          {empresas.map((emp) => (
            <div
              key={emp.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition"
            >
              <div>
                <p className="font-semibold">{emp.nome}</p>
                <p className="text-xs text-gray-300">ID: {emp.id}</p>
                <p className="text-xs text-gray-300">{emp.telefone}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(emp)}
                  className="bg-blue-500 hover:bg-blue-600 transition px-3 py-1 rounded shadow"
                >
                  ✏️
                </button>

                <button
                  onClick={() => handleToggle(emp)}
                  className={`px-3 py-1 rounded text-white shadow transition ${
                    emp.ativa
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {emp.ativa ? "🔒" : "🔓"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
