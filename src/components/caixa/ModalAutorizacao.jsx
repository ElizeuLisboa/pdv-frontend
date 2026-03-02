import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function ModalAutorizacao({ open, onClose, operador, acao }) {
  const [adminUsuario, setAdminUsuario] = useState("");
  const [adminSenha, setAdminSenha] = useState("");
  const [valor, setValor] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const precisaValor = acao === "SANGRIA" || acao === "SUPRIMENTO";

  // console.log("OPERADOR RECEBIDO NO MODAL:", operador);
  const autenticarAdmin = async () => {
    try {
      const res = await api.post("/auth/validar-admin", {
        email: adminUsuario,
        password: adminSenha,
      });
      console.log("ADMIN VALIDADO:", res.data);
      return res.data; // { id, nome, role }
    } catch (err) {
      console.error("Erro ao validar admin:", err);
      toast.error("Usuário admin inválido ou senha incorreta.");
      return null;
    }
  };

  const handleAutorizar = async () => {
    if (!valor) {
      toast.error("Informe o valor da sangria");
      return;
    }

    setLoading(true);

    try {
      const admin = await autenticarAdmin();
      if (!admin) {
        setLoading(false);
        return;
      }

      const operadorId = operador?.id || operador?.cliente?.id;
      console.log("Operador ID usado:", operadorId);

      await api.post(
        `/auditoria?operadorId=${operadorId}&autorizadoPor=${admin.id}`,
        {
          acao,
          valor: Number(valor),
          detalhes: detalhes || null,
        }
      );

      toast.success("Sangria autorizada com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar sangria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Autorização Necessária
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Usuário (Admin)
          </label>
          <input
            type="email"
            placeholder="Informe seu e-mail"
            autoComplete="off"
            spellCheck="false"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={adminUsuario}
            onChange={(e) => setAdminUsuario(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            autoComplete="off"
            placeholder="Informe sua senha [Admin]"
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={adminSenha}
            onChange={(e) => setAdminSenha(e.target.value)}
          />
        </div>

        <hr className="my-4" />

        {precisaValor && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Valor</label>
            <input
              type="number"
              value={valor}
              min={0}
              onChange={(e) => setValor(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="0.00"
            />
          </div>
        )}


        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Detalhes (opcional)
          </label>
          <textarea
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
            rows={3}
          ></textarea>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>


          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handleAutorizar}
            disabled={loading}
          >
            {loading ? "Processando..." : "Autorizar"}
          </button>
        </div>
      </div>
    </div>
  );
}
