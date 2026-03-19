import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import CupomTeste from "./CupomTeste";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ModalPagamento({
  total,
  itens,
  clienteId,
  pedidoId,
  origem = "PDV",
  onClose,
  onConfirm,
}) {
  const [forma, setForma] = useState(null);
  const [parcelas, setParcelas] = useState(1);
  const [valorPago, setValorPago] = useState("");
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [qrString, setQrString] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [aguardandoPix, setAguardandoPix] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const qrImgRef = useRef(null);
  const jurosMensal = 0.03;
  const isSite = origem === "SITE";
  const [mostrarCupom, setMostrarCupom] = useState(false);
  const [pedidoFinalizado, setPedidoFinalizado] = useState(null);
  const [pixTxid, setPixTxid] = useState(null);
  const pixIntervalRef = useRef(null);

  useEffect(() => {
    if (!forma) {
      setForma(isSite ? "PIX" : "DINHEIRO");
    }
  }, [forma, isSite]);

  useEffect(() => {
    if (!onClose) return;

    // sempre que abrir o modal, limpa estado
    setQrCodeBase64(null);
    setQrString(null);
    setPaymentId(null);
    setAguardandoPix(false);

    if (pixIntervalRef.current) {
      clearInterval(pixIntervalRef.current);
      pixIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    console.log("ModalPagamento MONTADO");
    return () => {
      console.log("ModalPagamento DESMONTADO");
    };
  }, []);

  useEffect(() => {
    console.log("mostrarCupom mudou:", mostrarCupom);
  }, [mostrarCupom]);

  const calcular = () => {
    if (forma === "CREDITO") {
      if (parcelas <= 3) {
        return { totalFinal: total, parcelaValor: total / parcelas };
      }
      const montante = total * Math.pow(1 + jurosMensal, parcelas);
      return { totalFinal: montante, parcelaValor: montante / parcelas };
    }
    return { totalFinal: total, parcelaValor: total };
  };

  const { totalFinal, parcelaValor } = calcular();

  // ====================== PIX SITE ======================
  const gerarPix = async () => {
    setLoadingPix(true);
    setQrCodeBase64(null);
    setQrString(null);
    setPaymentId(null);
    setAguardandoPix(false);

    try {
      const token = localStorage.getItem("token")?.replace(/"/g, "");
      const usuario = localStorage.getItem("usuario");
      const nomeCliente = usuario ? JSON.parse(usuario).nome : "Cliente";

      const res = await api.post(
        `/pagamentos/pix/gerar`,
        {
          metodoPagamento: "PIX",
          pedidoId,
          valor: Number(totalFinal),
          nome: nomeCliente,
          descricao: `Pedido #${pedidoId}`,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      const data = res.data || {};

      setQrCodeBase64(data.qrCodeBase64 ?? null);
      setQrString(data.codigo ?? null);
      setPaymentId(data.txid ?? null);
      setPixTxid(res.data.txid);
      setAguardandoPix(true);
    } catch (err) {
      console.error("Erro SITE PIX:", err);
      toast.error("Erro ao gerar PIX");
    } finally {
      setLoadingPix(false);
    }
  };

  // ====================== PIX PDV / CAIXA ======================
  const gerarPixPDV = async () => {
    setLoadingPix(true);
    setQrCodeBase64(null);
    setQrString(null);
    setPaymentId(null);
    setAguardandoPix(false);

    try {
      const token = localStorage.getItem("token");
      console.log(JSON.parse(atob(token.split(".")[1])));
      // usuario do caixa
      const usuario = localStorage.getItem("usuario");
      const nomeCliente = usuario ? JSON.parse(usuario).nome : "Cliente PDV";
      const empresaId = usuario.empresaId;

      const itensFormatados = itens.map((i) => ({
        produtoId: i.produtoId ?? i.id,
        quantidade: i.quantidade ?? 1,
        valor: i.price ?? i.valor ?? 0,
      }));

      const res = await api.post(
        `/caixa/finalizar`,
        {
          metodoPagamento: "PIX",
          clienteId: clienteId || null,
          empresaId, // ✅ IMPORTANTE
          itens: itensFormatados,
          valorTotal: total,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      setPedidoFinalizado(res.data);

      const dadosPix = res.data?.dadosPix;
      const txid = dadosPix?.pixTxid;

      setQrCodeBase64(dadosPix?.pixQrCodeBase64 ?? null);
      setQrString(dadosPix?.pixCodigo ?? null);
      setPaymentId(txid ?? null);
      setPixTxid(txid ?? null);

      setAguardandoPix(true);

      console.log("TXID RECEBIDO:", txid);
      if (txid) {
        iniciarMonitorPix(txid);
      } else {
        console.log("⚠️ TXID não encontrado no retorno");
      }
    } catch (err) {
      console.error(
        "❌ Erro PDV PIX completo:",
        err.response?.data || err.message,
      );
      toast.error(err.response?.data?.message || "Erro ao gerar PIX do PDV");
    } finally {
      setLoadingPix(false);
    }
  };

  const iniciarMonitorPix = (txid) => {
    if (!txid) return;

    if (pixIntervalRef.current) {
      clearInterval(pixIntervalRef.current);
    }

    let tentativas = 0;
    const MAX_TENTATIVAS = 40;
    console.log("Monitor verificando status...");

    pixIntervalRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/pagamentos/status/${txid}`);
        const status = res.data?.status;
        console.log("STATUS PIX:", status);
        console.log("Resposta da finalização:", res.data);

        const statusNormalizado = status?.toUpperCase();

        if (
          statusNormalizado === "PAGO" ||
          statusNormalizado === "APPROVED" ||
          statusNormalizado === "CONFIRMADO"
        ) {
          clearInterval(pixIntervalRef.current);
          pixIntervalRef.current = null;

          toast.success("✅ PIX confirmado!");
          setAguardandoPix(false);
          await new Promise((resolve) => setTimeout(resolve, 800));
          const payload = {
            metodoPagamento: "PIX",
            parcelas: 1,
            totalComJuros: Number(totalFinal),
          };
          console.log("PIX detectado como pago, chamando onConfirm");
          console.log("Payload onConfirm PIX:", statusNormalizado);
          setMostrarCupom(true);
          await onConfirm(payload);

          setMostrarCupom(true);

          // limpar estados
          setQrCodeBase64(null);
          setQrString(null);
          setPaymentId(null);
          setAguardandoPix(false);
        }

        tentativas++;
        if (tentativas >= MAX_TENTATIVAS) {
          clearInterval(pixIntervalRef.current);
          pixIntervalRef.current = null;

          toast.warning("Tempo de pagamento expirado");
          setAguardandoPix(false);
        }
      } catch (err) {
        console.log("❌ ERRO REAL:", err);
        console.log("❌ ERRO REAL RESPONSE:", err?.response?.data);
      }
    }, 3000);
  };

  const confirmarPagamento = async () => {
    if (!forma) {
      toast.info("Selecione a forma de pagamento");
      return;
    }

    if (isSite && forma === "CREDITO") {
      await onConfirm({
        metodoPagamento: "CREDITO",
        parcelas,
        totalComJuros: Number(totalFinal),
      });
      return;
    }
    if (isSite && forma === "PIX") {
      toast.info("Aguardando pagamento PIX");
      return;
    }
    const troco =
      forma === "DINHEIRO"
        ? Math.max(Number(valorPago || 0) - Number(totalFinal), 0)
        : 0;

    await onConfirm({
      metodoPagamento: forma,
      parcelas,
      totalComJuros: Number(totalFinal),
      troco,
    });
    onClose();
  };

  // console.log("mostrarCupom:", mostrarCupom);
  // console.log("pedidoFinalizado:", pedidoFinalizado);

  {
    mostrarCupom && pedidoFinalizado && (
      <CupomTeste
        pedido={pedidoFinalizado}
        onFechar={() => {
          setMostrarCupom(false);
          onClose();
        }}
      />
    );
  }

  const simularPixPago = async (txid) => {
    return api.post(`/pagamentos/simular/${txid}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 max-w-2xl p-6 rounded shadow-lg">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">Pagamento</h3>
          <button onClick={onClose}>Fechar</button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold">
            R$ {Number(total).toFixed(2)}
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {!isSite && (
            <>
              <button onClick={() => setForma("DINHEIRO")}>DINHEIRO</button>
              <button onClick={() => setForma("DEBITO")}>DEBITO</button>
            </>
          )}

          <button onClick={() => setForma("CREDITO")}>CREDITO</button>
          <button onClick={() => setForma("PIX")}>PIX</button>
        </div>

        {forma === "CREDITO" && (
          <div className="mb-4">
            <label>Parcelas</label>
            <select
              value={parcelas}
              onChange={(e) => setParcelas(Number(e.target.value))}
              className="w-full border p-2 rounded"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}x {n <= 3 ? "sem juros" : "com juros"}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isSite && forma === "DINHEIRO" && (
          <div className="mb-4">
            <label>Valor recebido</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={valorPago}
              min={0}
              onChange={(e) => setValorPago(e.target.value)}
            />
            <div className="mt-2 font-semibold">
              Troco: R${" "}
              {Math.max(Number(valorPago || 0) - Number(totalFinal), 0).toFixed(
                2,
              )}
            </div>
          </div>
        )}

        {/* ================= BLOCO PIX ================= */}
        {forma === "PIX" && (
          <div className="text-center bg-gray-50 p-4 rounded-lg border">
            {!qrCodeBase64 && (
              <button
                onClick={isSite ? gerarPix : gerarPixPDV}
                disabled={loadingPix}
                className="bg-emerald-600 text-white px-4 py-2 rounded"
              >
                {loadingPix ? "Gerando PIX..." : "Gerar QR Code PIX"}
              </button>
            )}

            {qrCodeBase64 && (
              <>
                <h4 className="font-semibold text-lg mb-2">Pague com PIX</h4>

                <p className="text-sm text-gray-600 mb-3">
                  Escaneie o QR Code no aplicativo do banco do cliente
                </p>

                <div className="bg-white p-3 inline-block rounded shadow">
                  <img
                    src={qrCodeBase64}
                    alt="QR Code PIX"
                    className="mx-auto w-60"
                  />
                </div>

                {/* 👉 SÓ MOSTRA COPIAR NO SITE, NÃO NO PDV */}
                {isSite && qrString && (
                  <div className="mt-4 text-left">
                    <label className="text-xs font-medium text-gray-600">
                      Código PIX (copia e cola)
                    </label>

                    <textarea
                      readOnly
                      className="w-full border p-2 text-xs rounded mt-1 bg-white"
                      rows={3}
                      value={qrString}
                    />

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(qrString);
                        toast.success("Código PIX copiado com sucesso!");
                      }}
                      className="mt-2 bg-gray-200 hover:bg-gray-300 transition px-3 py-1 rounded text-sm"
                    >
                      Copiar código PIX
                    </button>
                  </div>
                )}

                {aguardandoPix && (
                  <div className="mt-3 text-purple-700 font-semibold animate-pulse">
                    ⏳ Aguardando confirmação do pagamento...
                  </div>
                )}

                {/* 👉 BOTÃO PARA TESTE SEM BANCO */}

                <button
                  onClick={async () => {
                    toast.success("PIX SIMULADO COMO PAGO");

                    await simularPixPago(pixTxid);
                    await onConfirm({
                      metodoPagamento: "PIX",
                      parcelas: 1,
                      totalComJuros: Number(totalFinal),
                    });

                    setMostrarCupom(true);

                    // ❌ NÃO CHAMA onConfirm aqui
                  }}
                  className="mt-4 bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Simular PIX PAGO
                </button>
              </>
            )}
          </div>
        )}
        {/* =============== FIM BLOCO PIX =============== */}
        <div className="mt-6 text-right">
          <div className="text-lg font-bold">
            Total com juros: R$ {Number(totalFinal).toFixed(2)}
          </div>

          {forma === "CREDITO" && (
            <div className="text-sm">
              {parcelas}x de R$ {Number(parcelaValor).toFixed(2)}
            </div>
          )}
        </div>

        {forma !== "PIX" && (
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose}>Cancelar</button>

            <button
              onClick={confirmarPagamento}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Confirmar
            </button>
          </div>
        )}

        {mostrarCupom && pedidoFinalizado && (
          <CupomTeste pedido={pedidoFinalizado} />
        )}
      </div>
    </div>
  );
}
