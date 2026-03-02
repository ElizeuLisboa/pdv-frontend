import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
// import { loadStripe } from "@stripe/stripe-js";

const FinalizarCompra = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("carrinho")) || [];
    setCarrinho(dados);
    setTotal(
      dados.reduce(
        (acc, item) => acc + item.produto.preco * item.quantidade,
        0,
      ),
    );
  }, []);

  const handleConfirmarPedido = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        items: carrinho.map((i) => ({
          produtoId: i.produto.id,
          quantity: i.quantidade,
        })),
      };
      await api.post("/pedidos", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Pedido confirmado!");
      localStorage.removeItem("carrinho");
      navigate("/pedidos/meus");
    } catch (err) {
      toast.error("Erro ao confirmar pedido. Faça login ou tente novamente.");
    }
  };

  return (
    <div className="p-4">
      <h2>Carrinho Final</h2>
      {carrinho.map((item) => (
        <div key={item.produto.id} className="flex justify-between mb-2">
          <span>
            {item.produto.nome} x {item.quantidade}
          </span>
          <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
        </div>
      ))}
      <h3>Total: R$ {total.toFixed(2)}</h3>
      <div className="flex gap-4 mt-4">
        <button onClick={handleConfirmarPedido} className="btn btn-primary">
          Confirmar Pedido
        </button>
        {/* <button onClick={handlePagarStripe} className="btn btn-green-600">Pagar com Stripe</button> */}
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-4 text-blue-600 hover:underline"
      >
        Voltar à Página Inicial
      </button>
    </div>
  );
};

export default FinalizarCompra;
