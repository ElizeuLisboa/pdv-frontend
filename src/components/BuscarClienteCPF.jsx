import React, { useState } from "react";
import InputMask from "react-input-mask";
import axios from "axios";

export default function BuscarClienteCPF({ onClienteEncontrado, onNovoCliente }) {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const buscarCliente = async () => {
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      setErro("CPF inválido");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const res = await api.get(`/clientes/buscar-cpf/${cpfLimpo}`);
      if (res.data) {
        onClienteEncontrado(res.data);
      } else {
        onNovoCliente(cpfLimpo);
      }
    } catch (err) {
      console.error(err);
      onNovoCliente(cpfLimpo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <label className="block font-semibold mb-1">CPF do cliente</label>
      <div className="flex gap-2">
        <InputMask mask="999.999.999-99" value={cpf} onChange={(e) => setCpf(e.target.value)} className="p-2 border rounded flex-1" onKeyDown={(e) => e.key === 'Enter' && buscarCliente()} />
        <button onClick={buscarCliente} className="px-3 py-2 bg-blue-600 text-white rounded">Buscar</button>
        <button onClick={() => onNovoCliente(cpf.replace(/\D/g, ''))} className="px-3 py-2 bg-gray-200 rounded">Cadastrar</button>
      </div>
      {erro && <div className="text-sm text-red-600 mt-1">{erro}</div>}
    </div>
  );
}
