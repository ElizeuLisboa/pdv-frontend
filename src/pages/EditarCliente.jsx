import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import PasswordInput from "../components/PasswordInput";
const cepRegex = /^\d{5}-?\d{3}$/;

export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { token } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "", // NO FORM ESTÁ DECLARADO COM ""
    cpf: "",
    password: "",
    cep: "",
    logradouro: "",
    cidade: "",
    estado: "",
    role: "CLIENTE",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const { data } = await api.get(`/clientes/${id}`);
        setForm({
          nome: data.nome,
          email: data.email,
          telefone: data.telefone || "", // AQUI ESTÁ data.telefone || ""
          cpf: data.cpf,
          password: "",
          cep: data.cep || "",
          logradouro: data.logradouro || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          role: data.role,
        });
      } catch (err) {
        toast.error("Erro ao carregar cliente.");
        console.error(err);
      }
    };

    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepBlur = async () => {
    if (!form.cep) return;

    if (!cepRegex.test(form.cep)) {
      toast.error("CEP inválido. Use o formato 12345-678 ou 12345678.");
      return;
    }

    try {
      const cepSemTraco = form.cep.replace("-", "");
      const res = await fetch(`https://viacep.com.br/ws/${cepSemTraco}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error("CEP não encontrado.");
      } else {
        setForm((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch {
      toast.error("Erro ao buscar CEP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.cpf) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (form.cep && !cepRegex.test(form.cep)) {
      toast.error("CEP inválido. Use o formato 12345-678 ou 12345678.");
      return;
    }

    const payload = {
      nome: form.nome,
      email: form.email,
      cpf: form.cpf || null,
      telefone: form.telefone || null, // payload telefone está com form.telefone || null
      cep: form.cep || null,
      logradouro: form.logradouro || null,
      cidade: form.cidade || null,
      estado: form.estado || null,
    };

    // COLOQUEI AQUI - linha 113
    if (form.cpf) payload.cpf = form.cpf;
    if (form.password) payload.password = form.password;
    if (usuario?.role === "SUPERUSER") payload.role = form.role;
     
    try {
      setLoading(true);
      await api.put(`/clientes/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // toast.success("Cliente atualizado com sucesso!");
      toast.success("Cadastro atualizado com sucesso!", {
        style: { backgroundColor: "#d1fae5", color: "#065f46" }, // verde suave
      });
      navigate("/clientes");
    } catch (err) {
      toast.error("Erro ao atualizar cliente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Editar Cliente</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder="CPF"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className="w-full border p-2 rounded"
          />
        </div>
        <PasswordInput
          value={form.password}
          onChange={handleChange}
          placeholder={
            usuario?.role === "SUPERUSER"
              ? "Digite nova senha para este usuário"
              : "Digite sua nova senha"
          }
          title={
            usuario?.role === "SUPERUSER"
              ? "Como SUPERUSER, você pode definir uma nova senha para esse usuário"
              : "Se quiser alterar sua senha, preencha este campo"
          }
        />

        {usuario?.role === "SUPERUSER" && (
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {usuario.role === "SUPERUSER" && (
              <option value="SUPERUSER">SUPERUSER</option>
            )}
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
            <option value="CAIXA">CAIXA</option>
            <option value="CLIENTE">CLIENTE</option>
          </select>
        )}

        <input
          type="text"
          name="cep"
          value={form.cep}
          onChange={handleChange}
          onBlur={handleCepBlur}
          placeholder="CEP (ex: 12345-678)"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="logradouro"
          value={form.logradouro}
          onChange={handleChange}
          placeholder="Logradouro (Rua, Av, etc)"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="cidade"
          value={form.cidade}
          onChange={handleChange}
          placeholder="Cidade"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          placeholder="Estado"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/produtos") }
          className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Voltar Pagina Inicial
        </button>
      </form>
    </div>
  );
}
