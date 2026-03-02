import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const cepRegex = /^\d{5}-?\d{3}$/;

function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    cep: "",
    logradouro: "",
    cidade: "",
    estado: "",
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCepBlur = async () => {
    if (!formData.cep) return;

    if (!cepRegex.test(formData.cep)) {
      setMensagem("CEP inválido. Use o formato 12345-678 ou 12345678.");
      return;
    }

    try {
      const cepSemTraco = formData.cep.replace("-", "");
      const res = await fetch(`https://viacep.com.br/ws/${cepSemTraco}/json/`);
      const data = await res.json();
      if (data.erro) {
        setMensagem("CEP não encontrado.");
      } else {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch {
      setMensagem("Erro ao buscar CEP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    // Validação básica
    if (!formData.nome || !formData.email || !formData.cpf || !formData.senha) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.cep && !cepRegex.test(formData.cep)) {
      setMensagem("CEP inválido. Use o formato 12345-678 ou 12345678.");
      return;
    }

    try {
      const response = await axios.post(
        "/clientes",
        formData
      );
      console.log("Cadastro bem-sucedido:", response.data);
      toast.success("Cadastro realizado com sucesso!", {
        style: {
          backgroundColor: "#dcfce7", // verde claro
          color: "#166534", // texto verde escuro
        },
      });
    } catch (err) {
      console.error(
        "Erro ao cadastrar cliente:",
        err.response?.data || err.message
      );

      if (err.response?.status === 409) {
        setMensagem(
          err.response.data.message || "CPF ou e-mail já cadastrados."
        );
      } else if (err.response?.status === 400) {
        setMensagem("Dados inválidos. Verifique o formulário.");
      } else {
        setMensagem("Erro ao cadastrar cliente. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4">Cadastro</h2>

        <input
          type="text"
          name="nome"
          placeholder="Nome"
          className="border p-2 mb-2 w-full"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 mb-2 w-full"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="cpf"
          placeholder="CPF (11 dígitos)"
          className="border p-2 mb-2 w-full"
          value={formData.cpf}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          className="border p-2 mb-2 w-full"
          value={formData.senha}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="cep"
          placeholder="CEP (ex: 12345-678)"
          className="border p-2 mb-2 w-full"
          value={formData.cep}
          onChange={handleChange}
          onBlur={handleCepBlur}
        />

        <input
          type="text"
          name="logradouro"
          placeholder="Logradouro"
          className="border p-2 mb-2 w-full"
          value={formData.logradouro}
          onChange={handleChange}
        />

        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          className="border p-2 mb-2 w-full"
          value={formData.cidade}
          onChange={handleChange}
        />

        <input
          type="text"
          name="estado"
          placeholder="Estado"
          className="border p-2 mb-2 w-full"
          value={formData.estado}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 mt-4 rounded hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Cadastro;
