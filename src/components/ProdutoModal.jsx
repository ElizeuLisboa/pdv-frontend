
import { toast } from "react-toastify";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

function ProdutoCard({ produto }) {
  const { addToCart } = useContext(CartContext);

  const handleComprar = () => {
    addToCart(produto);
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">{produto.title}</h3>
      <p>R$ {produto.price.toFixed(2)}</p>
      <button
        onClick={handleComprar}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Comprar
      </button>
    </div>
  );
}
