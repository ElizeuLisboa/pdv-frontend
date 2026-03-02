import React, { useState } from "react";
import { toast } from "react-toastify";

const ModalCadastroRapido = ({ isOpen, onClose, onSalvar }) => {
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [clienteExiste, setClienteExiste] = useState(false);
  const [loadingBusca, setLoadingBusca] = useState(false);
  const token = localStorage.getItem("token");

  // ---- CPF MASK ----
  const formatarCPF = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
    return apenasNumeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const handleChangeCPF = (e) => {
    setCpf(formatarCPF(e.target.value));
  };

  // ---- TELEFONE MASK ----
  const formatarTelefone = (valor) => {
    const nums = valor.replace(/\D/g, "").slice(0, 11);

    if (nums.length <= 10) {
      return nums
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return nums
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleChangeTelefone = (e) => {
    setTelefone(formatarTelefone(e.target.value));
  };

  // ----- BUSCAR POR CPF -----
  const handleBlurCPF = async () => {
    const apenasNumeros = cpf.replace(/\D/g, "");

    if (apenasNumeros.length !== 11) return;

    setLoadingBusca(true);
    try {
      const res = await fetch(
        `/clientes/buscar-cpf/${apenasNumeros}`
      );
      const data = await res.json();

      if (res.ok) {
        setClienteExiste(true);
        setNome(data.nome || "");
        setEmail(data.email || "");
        setTelefone(formatarTelefone(data.telefone || ""));
      } else {
        setClienteExiste(false);
        setNome("");
        setEmail("");
        setTelefone("");
      }
    } catch (err) {
      console.error("Erro ao buscar cliente", err);
    } finally {
      setLoadingBusca(false);
    }
  };

  // ---- SALVAR / ATUALIZAR ----

  const handleSalvar = async () => {
    const cpfNumerico = cpf.replace(/\D/g, "");
    const telefoneNumerico = telefone.replace(/\D/g, "");

    let url = "";
    let metodo = "";
    let body = {};

    if (clienteExiste) {
      // PUT NÃO LEVA CPF NO BODY
      url = `/clientes/cadastro-rapido/${cpfNumerico}`;
      metodo = "PUT";
      body = {
        nome,
        email,
        telefone: telefoneNumerico,
      };
    } else {
      // POST LEVA CPF
      url = `/clientes/cadastro-rapido`;
      metodo = "POST";
      body = {
        cpf: cpfNumerico,
        nome,
        email,
        telefone: telefoneNumerico,
      };
    }

    try {

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });

      const resposta = await res.text();
      console.log("Resposta do servidor:", resposta);

      if (!res.ok) throw new Error("Erro");

      const cliente = JSON.parse(resposta);
      onSalvar(cliente);
      onClose();
    } catch (err) {
      console.error("Erro no handleSalvar:", err);
      toast.error("Erro ao salvar cliente.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[420px]">
        <h2 className="text-xl font-semibold mb-4">
          Cadastro Rápido de Cliente
        </h2>

        <div className="space-y-3">
          {/* CPF */}
          <input
            type="text"
            value={cpf}
            onChange={handleChangeCPF}
            onBlur={handleBlurCPF}
            disabled={clienteExiste || loadingBusca}
            placeholder="CPF"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
          />

          {/* Nome */}
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          {/* Telefone */}
          <input
            type="text"
            value={telefone}
            onChange={handleChangeTelefone}
            placeholder="Telefone"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSalvar}
            className={`px-4 py-2 rounded-lg text-white transition ${
              clienteExiste
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {clienteExiste ? "Atualizar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCadastroRapido;
