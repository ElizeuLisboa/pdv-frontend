import React, { useState } from "react";
import api from "../services/api";

export default function TransportadoraModal({ isOpen, onClose, onTransportadoraCadastrada }) {
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    fretes: "",
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: "",
    tipoVeiculo: "Carro",
  });
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/transportadoras", form);
      onTransportadoraCadastrada(res.data);
      onClose();
    } catch (err) {
      setErro("Erro ao cadastrar transportadora");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nova Transportadora</h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>
        {erro && <p className="text-red-500 mb-2">{erro}</p>}
        <form className="grid grid-cols-2 gap-2" onSubmit={handleSubmit}>
          <input placeholder="Nome" name="nome" value={form.nome} onChange={handleChange} required />
          <input placeholder="CNPJ" name="cnpj" value={form.cnpj} onChange={handleChange} required />
          <input placeholder="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
          <input placeholder="Fretes" name="fretes" value={form.fretes} onChange={handleChange} />
          <input placeholder="CEP" name="cep" value={form.cep} onChange={handleChange} />
          <input placeholder="Logradouro" name="logradouro" value={form.logradouro} onChange={handleChange} />
          <input placeholder="Bairro" name="bairro" value={form.bairro} onChange={handleChange} />
          <input placeholder="Cidade" name="cidade" value={form.cidade} onChange={handleChange} />
          <input placeholder="Estado" name="estado" value={form.estado} onChange={handleChange} />
          <select name="tipoVeiculo" value={form.tipoVeiculo} onChange={handleChange}>
            <option>Carro</option>
            <option>Caminhão</option>
            <option>Moto</option>
            <option>Van</option>
            <option>Outro</option>
          </select>
          <button type="submit" className="col-span-2 bg-amber-600 text-white py-2 rounded hover:bg-amber-700">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
