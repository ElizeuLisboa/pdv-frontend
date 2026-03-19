import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function PixSiteModal({ total, onClose }) {
  const [qrBase64, setQrBase64] = useState(null);
  const [codigo, setCodigo] = useState(null);
  const [txid, setTxid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("GERANDO");

  const pedidoId = localStorage.getItem("pedidoId");
  const token = localStorage.getItem("token");

  // 🔹 GERA PIX
  const gerarPix = async () => {
    try {
      setLoading(true);

      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

      const res = await api.post(
        `/pagamentos/pix/gerar`,
        {
          pedidoId: Number(pedidoId),
          valor: Number(total),
          nome: usuario.nome || "Cliente",
          descricao: `Pedido #${pedidoId}`,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = res.data;

      setQrBase64(data.qrCodeBase64);
      setCodigo(data.codigo);
      setTxid(data.txid);

      setStatus("AGUARDANDO");

    } catch (err) {
      console.error("❌ ERRO PIX SITE:", err.response?.data || err.message);
      toast.error("Erro ao gerar PIX");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 MONITOR STATUS
  useEffect(() => {
    if (!txid) return;

    const timer = setInterval(async () => {
      try {
        const res = await api.get(`/pagamentos/status/${txid}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const st = res.data.status;

        setStatus(st);

        if (st === "PAGO") {
          toast.success("Pagamento confirmado!");
          clearInterval(timer);

          // limpa carrinho
          localStorage.removeItem("pedidoId");

          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch {}
    }, 4000);

    return () => clearInterval(timer);
  }, [txid]);

  useEffect(() => {
    gerarPix();
  }, []);

  const copiar = () => {
    navigator.clipboard.writeText(codigo);
    toast.success("Código PIX copiado!");
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[420px] text-center">
        <h2 className="text-xl font-bold mb-3">Pagamento PIX</h2>

        <p className="text-sm mb-2">
          Pedido #{pedidoId} — Total: R$ {total}
        </p>

        {loading && <p>Gerando PIX...</p>}

        {qrBase64 && (
          <>
            <img
              className="mx-auto mb-3 w-56"
              src={`data:image/png;base64,${qrBase64}`}
            />

            <button
              onClick={copiar}
              className="bg-blue-600 text-white px-3 py-1 rounded mb-3"
            >
              Copiar código PIX
            </button>

            <div className="text-sm">
              Status: <b>{status}</b>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-red-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
