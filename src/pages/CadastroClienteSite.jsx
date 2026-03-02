import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function CadastroClienteSite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cep: "",
    logradouro: "",
    cidade: "",
    estado: "",
    password: "",
  });

  const [confirmar, setConfirmar] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= MÁSCARAS =================

  const maskCPF = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const maskTelefone = (v) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");

  const maskCEP = (v) => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");

  const validarCPF = (cpf) => cpf.replace(/\D/g, "").length === 11;

  // ================= BUSCA CEP =================

  const buscarCEP = async (cep) => {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      setForm((p) => ({
        ...p,
        logradouro: data.logradouro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch {
      toast.error("Erro ao buscar CEP");
    }
  };

  // ================= HANDLERS =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cpf") {
      setForm((p) => ({ ...p, cpf: maskCPF(value) }));
      return;
    }

    if (name === "telefone") {
      setForm((p) => ({ ...p, telefone: maskTelefone(value) }));
      return;
    }

    if (name === "cep") {
      const v = maskCEP(value);
      setForm((p) => ({ ...p, cep: v }));
      if (v.length === 9) buscarCEP(v);
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validarCPF(form.cpf)) {
        toast.error("CPF inválido");
        setLoading(false);
        return;
      }

      if (form.password !== confirmar) {
        toast.error("As senhas não conferem");
        setLoading(false);
        return;
      }

      const payload = {
        ...form,
        cpf: form.cpf.replace(/\D/g, ""), // 👈 só números
      };

      await api.post("/clientes/auto-cadastro", payload);

      toast.success("Cadastro realizado com sucesso!");

      // após cadastrar, leva pro login ou checkout
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao cadastrar cliente");
    } finally {
      setLoading(false);
    }
  };

  // ================= TELA =================

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">Cadastro</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="nome"
          placeholder="Nome completo"
          className="w-full border p-2 rounded"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="cpf"
          placeholder="CPF"
          className="w-full border p-2 rounded"
          value={form.cpf}
          onChange={handleChange}
          required
        />

        <input
          name="telefone"
          placeholder="Telefone"
          className="w-full border p-2 rounded"
          value={form.telefone}
          onChange={handleChange}
          required
        />

        <input
          name="cep"
          placeholder="CEP"
          className="w-full border p-2 rounded"
          value={form.cep}
          onChange={handleChange}
          required
        />

        <input
          name="logradouro"
          placeholder="Logradouro"
          className="w-full border p-2 rounded"
          value={form.logradouro}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            name="cidade"
            placeholder="Cidade"
            className="w-full border p-2 rounded"
            value={form.cidade}
            onChange={handleChange}
          />

          <input
            name="estado"
            placeholder="Estado"
            className="w-full border p-2 rounded"
            value={form.estado}
            onChange={handleChange}
          />
        </div>

        {/* ===== SENHA COM OLHINHO ===== */}
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Senha"
            className="w-full border p-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />

          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "🙈" : "👁"}
            {/* {showPass ? <FiEyeOff /> : <FiEye />} */}
          </span>
        </div>

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Confirmar senha"
            className="w-full border p-2 rounded"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "🙈" : "👁"}
            {/* {showPass ? <FiEyeOff /> : <FiEye />} */}
          </span>
        </div>

        {/* <input
          type={showPass ? "text" : "password"}
          placeholder="Confirmar senha"
          className="w-full border p-2 rounded"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        />
        <span
          className="absolute right-3 top-3 cursor-pointer"
          onClick={() => setShowPass(!showPass)}
        >
          {showPass ? <FiEyeOff /> : <FiEye />}
        </span> */}

        <button
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
