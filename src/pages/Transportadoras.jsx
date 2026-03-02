import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function NovaTransportadora() {
  const navigate = useNavigate();
  const [warnCnpj, setWarnCnpj] = useState(false);

  const [form, setForm] = useState({
    numero: "",
    nome: "",
    cnpj: "",
    telefone: "",
    frete: "",
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    tipoVeiculo: "",
  });

  // 👉 Gera automaticamente o próximo número da transportadora
  useEffect(() => {
    gerarCodigoInterno();
  }, []);

  const gerarCodigoInterno = async () => {
    try {
      const res = await axios.get("/transportadoras");
      const lista = res.data;

      let maior = 0;

      lista.forEach((t) => {
        if (t.numero) {
          const numeroLimpo = parseInt(t.numero.replace(/\D/g, ""));
          if (!isNaN(numeroLimpo) && numeroLimpo > maior) maior = numeroLimpo;
        }
      });

      const proximo = (maior + 1).toString().padStart(4, "0");
      setForm((prev) => ({ ...prev, numero: `T-${proximo}` }));
    } catch (err) {
      console.error("Erro ao gerar código interno:", err);
      toast.error("Erro ao gerar código interno da transportadora");
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "telefone") {
      value = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }

    setForm({ ...form, [name]: value });
  };

  const handleBlurCep = async () => {
    if (form.cep.length < 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${form.cep}/json/`);
      const data = await res.json();

      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
    }
  };

  const validarCnpj = (cnpj) => {
    return cnpj.replace(/\D/g, "").length === 14;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCnpj(form.cnpj)) {
      setWarnCnpj(true);
      toast.warn("⚠️ CNPJ inválido (modo teste: cadastro liberado).");
    }

    try {
      const payload = {
        ...form,
        frete: form.frete ? Number(form.frete) : null,
      };
      await axios.post("/transportadoras", payload);
      toast.success("Transportadora cadastrada!");
      navigate("/transportadoras");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar transportadora");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Nova Transportadora</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Código interno gerado automaticamente */}
        <input
          type="text"
          name="numero"
          value={form.numero}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 text-gray-600"
        />

        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="cnpj"
          placeholder="CNPJ"
          value={form.cnpj}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${
            warnCnpj ? "border-yellow-400" : ""
          }`}
        />
        {warnCnpj && (
          <p className="text-yellow-600 text-sm">
            ⚠️ CNPJ inválido, mas cadastro liberado (modo teste).
          </p>
        )}

        <input
          type="text"
          name="telefone"
          placeholder="Telefone (11) 99999-9999"
          value={form.telefone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="frete"
          placeholder="Valor do Frete"
          value={form.frete}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="cep"
          placeholder="CEP"
          value={form.cep}
          onChange={handleChange}
          onBlur={handleBlurCep}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="logradouro"
          placeholder="Logradouro"
          value={form.logradouro}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="bairro"
          placeholder="Bairro"
          value={form.bairro}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="cidade"
          placeholder="Cidade"
          value={form.cidade}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="estado"
          placeholder="Estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <select
          name="tipoVeiculo"
          value={form.tipoVeiculo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecione o tipo de veículo</option>
          <option value="Carro">Carro</option>
          <option value="Caminhão">Caminhão</option>
          <option value="Moto">Moto</option>
          <option value="Van">Van</option>
          <option value="Outro">Outro</option>
        </select>
        <div className="Flex gap-4">
          <button
            type="submit"
            className="w-72 bg-amber-600 text-white p-2 rounded hover:bg-amber-700"
          >
            Cadastrar
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-72 bg-gray-600  text-white p-2 rounded hover:bg-gray-700"
          >
            Voltar à Página Inicial
          </button>
        </div>
      </form>
    </div>
  );
}
