import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

export default function UploadComprovante({ pedidoId, onUploaded, jaEnviado }) {
  const { token, usuario, loading: usuarioLoading } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [nomeRecebedor, setNomeRecebedor] = useState("");
  const [entregadorNome, setEntregadorNome] = useState("");
  const [loading, setLoading] = useState(false);

  // Aguarda usuário ser carregado
  if (usuarioLoading) return null;

  // Checa se é ADMIN ou SUPERUSER
  const isAdmin =
    !!usuario && (usuario.role === "ADMIN" || usuario.role === "SUPERUSER");

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecione um arquivo!");
      return;
    }
    if (!nomeRecebedor) {
      toast.error("Informe o nome do recebedor!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("imagem", file);
      formData.append("pedidoId", pedidoId);
      formData.append("nomeRecebedor", nomeRecebedor);
      formData.append("entregadorNome", entregadorNome);

      for (let pair of formData.entries()) {
        console.log(pair[0]);
      }

      await api.post("/comprovantes/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Comprovante enviado com sucesso!");
      onUploaded?.();

      // Limpa inputs
      setFile(null);
      setNomeRecebedor("");
      setEntregadorNome("");
    } catch (error) {
      console.error("Erro ao enviar comprovante:", error);
      toast.error("Erro ao enviar comprovante.");
    } finally {
      setLoading(false);
    }
  };

  if (jaEnviado && !isAdmin) {
    return (
      <div className="mt-4 text-green-600 font-semibold text-sm">
        ✅ Pedido entregue e comprovante enviado.
      </div>
    );
  }

  // Inputs sempre visíveis para ADMIN ou SUPERUSER
  return (
    // <div className="flex flex-col sm:flex-row gap-3 mt-4 border-t pt-4">
    //   <input
    //     type="text"
    //     placeholder="Nome do Recebedor"
    //     value={nomeRecebedor}
    //     onChange={(e) => setNomeRecebedor(e.target.value)}
    //     className="border p-2 rounded flex-1 text-sm"
    //   />
    //   <input
    //     type="text"
    //     placeholder="Nome do Entregador"
    //     value={entregadorNome}
    //     onChange={(e) => setEntregadorNome(e.target.value)}
    //     className="border p-2 rounded flex-1 text-sm"
    //   />
    //   <input
    //     type="file"
    //     accept="image/*"
    //     onChange={(e) => setFile(e.target.files[0])}
    //     className="border p-2 rounded flex-1 text-sm"
    //   />
    //   <button
    //     onClick={handleUpload}
    //     disabled={loading}
    //     className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm ${
    //       loading ? "cursor-not-allowed" : ""
    //     }`}
    //   >
    //     {loading
    //       ? "Enviando..."
    //       : jaEnviado
    //         ? "Reenviar Comprovante"
    //         : "Enviar"}
    //   </button>
    // </div>

    <div className="flex flex-col sm:flex-row gap-2 mt-4 border-t pt-4">
      <input
        type="text"
        placeholder="Entregador"
        value={entregadorNome}
        onChange={(e) => setEntregadorNome(e.target.value)}
        className="border p-2 rounded flex-1 text-sm"
      />

      <input
        type="text"
        placeholder="Recebedor"
        value={nomeRecebedor}
        onChange={(e) => setNomeRecebedor(e.target.value)}
        className="border p-2 rounded flex-1 text-sm"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded flex-1 text-sm"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
      >
        {loading ? "Enviando..." : jaEnviado ? "Reenviar" : "Enviar"}
        {jaEnviado && (
          <p className="text-green-600 text-sm mt-2">✅ Comprovante enviado</p>
        )}
      </button>
    </div>
  );
}
