import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { maskCardNumber, maskCPF, getCardBrand } from "../utils/masks";
import { useAuth } from "../contexts/AuthContext";

export default function MercadoPagoCardPayment({ valor, onClose }) {
  const [mp, setMp] = useState(null);
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [form, setForm] = useState({
    cardNumber: "",
    cardholderName: "",
    cardExpirationMonth: "",
    cardExpirationYear: "",
    securityCode: "",
    docNumber: "",
    installments: 1,
  });

  useEffect(() => {
    if (!usuario) {
      toast.error("Você precisa estar logado para pagar");
      onClose();
    }
  }, []);


  /* ---------------- INIT MERCADO PAGO ---------------- */
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;

    if (!publicKey || !window.MercadoPago) {
      console.error("MercadoPago SDK ou Public Key ausente");
      return;
    }

    const instance = new window.MercadoPago(publicKey, {
      locale: "pt-BR",
    });

    setMp(instance);
  }, []);

  /* ---------------- BANDEIRA DO CARTÃO ---------------- */

  const brand = getCardBrand(form.cardNumber);

  useEffect(() => {
    console.log("Número:", form.cardNumber);
    console.log("Brand:", brand);
  }, [form.cardNumber, brand]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    setForm((prev) => ({
      ...prev,
      cardNumber: maskCardNumber(e.target.value),
    }));
  };

  const criarToken = async () => {
    if (!mp) throw new Error("MercadoPago não inicializado");

    const cpf = form.docNumber.replace(/\D/g, "");

    const cardData = {
      cardNumber: form.cardNumber.replace(/\s/g, ""),
      cardholderName: form.cardholderName,
      cardExpirationMonth: form.cardExpirationMonth,
      cardExpirationYear: `20${form.cardExpirationYear}`,
      securityCode: form.securityCode,
      identificationType: "CPF",
      identificationNumber: cpf,
    };

    const tokenResponse = await mp.createCardToken(cardData);

    if (!tokenResponse?.id) {
      console.error("Erro token MP:", tokenResponse);
      throw new Error("Falha ao gerar token do cartão");
    }

    return {
      token: tokenResponse.id,
      paymentMethodId: tokenResponse.payment_method_id,
      cpf, // ✅ agora existe
    };
  };

  const pagar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, cpf } = await criarToken();

      const pedidoId = localStorage.getItem("pedidoId");

      if (!pedidoId) {
        toast.error("Pedido não encontrado");
        setLoading(false);
        return;
      }

      const res = await api.post("/pagamentos/mercadopago/cartao", {
        pedidoId,
        token,
        valor,
        installments: Number(form.installments),
        payer: {
          identification: {
            type: "CPF",
            number: cpf,
          },
        },
      });

      console.log("Resposta pagamento MP:", res.data);

      const { id, status } = res.data;

      // ========= SUCESSO =========
      if (status === "approved") {
        clearCart();
        onClose();

        // 👉 AGORA COMPATÍVEL COM Sucesso.jsx
        navigate(`/sucesso?external_reference=${pedidoId}&status=${status}`);

        return;
      }

      // ========= OUTROS STATUS =========
      toast.info(`Pagamento ${status}`);
    } catch (err) {
      console.error("Erro pagamento MP:", err);
      toast.error("Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  
  /* ---------------- UI ---------------- */
  return (
    <form
      onSubmit={pagar}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-5"
    >
      <h3 className="text-xl font-semibold text-center">
        Pagamento com Cartão
      </h3>

      {/* Cartão */}
      <div>
        <label className="text-sm font-medium">Número do cartão</label>
        <div className="relative">
          <input
            value={form.cardNumber}
            onChange={handleCardChange}
            placeholder="0000 0000 0000 0000"
            className="w-full pr-12 border rounded-lg px-3 py-2"
            required
          />
          {brand && (
            <img
              src={`/cards/${brand}.svg`}
              alt={brand}
              className="h-6 absolute right-3 top-1/2 -translate-y-1/2"
            />
          )}
        </div>
      </div>

      {/* Nome */}
      <input
        name="cardholderName"
        placeholder="Nome no cartão"
        value={form.cardholderName}
        onChange={handleChange}
        required
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Validade + CVV */}
      <div className="grid grid-cols-3 gap-3">
        <input
          name="cardExpirationMonth"
          placeholder="MM"
          value={form.cardExpirationMonth}
          onChange={handleChange}
          required
          className="border rounded-lg px-3 py-2 text-center"
        />
        <input
          name="cardExpirationYear"
          placeholder="AA"
          value={form.cardExpirationYear}
          onChange={handleChange}
          required
          className="border rounded-lg px-3 py-2 text-center"
        />
        <input
          name="securityCode"
          placeholder="CVV"
          value={form.securityCode}
          onChange={handleChange}
          required
          className="border rounded-lg px-3 py-2 text-center"
        />
      </div>

      {/* CPF */}
      <input
        placeholder="CPF do titular"
        value={form.docNumber}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            docNumber: maskCPF(e.target.value),
          }))
        }
        required
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Parcelas */}
      <select
        name="installments"
        value={form.installments}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
      >
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={3}>3x</option>
        <option value={4}>4x</option>
        <option value={5}>5x</option>
        <option value={6}>6x</option>
        <option value={7}>7x</option>
        <option value={8}>8x</option>
        <option value={9}>9x</option>
        <option value={10}>10x</option>
        <option value={11}>11x</option>
        <option value={12}>12x</option>
      </select>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Processando..." : "Pagar agora"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex-1 border py-2 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
