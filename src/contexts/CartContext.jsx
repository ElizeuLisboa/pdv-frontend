import { createContext, useContext, useState } from "react";

export const CartContext = createContext({
  itens: [],
  adicionarProduto: () => {},
  removerProduto: () => {},
  limparCarrinho: () => {},
  atualizarQuantidade: () => {},
  totalItens: 0,
  totalValor: 0,
});

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]);

  const limparCarrinho = () => setItens([]);

  const clearCart = limparCarrinho; // alias OK agora ✅

  const adicionarProduto = (produto) => {
    setItens((prev) => {
      const existente = prev.find((p) => p.id === produto.id);

      const qtd = produto.quantidade || 1;

      if (existente) {
        return prev.map((p) =>
          p.id === produto.id ? { ...p, quantidade: p.quantidade + qtd } : p,
        );
      }

      return [...prev, { ...produto, quantidade: qtd }];
    });
  };

  const removerProduto = (id) => {
    setItens((prev) => prev.filter((p) => p.id !== id));
  };

  const atualizarQuantidade = (id, quantidade) => {
    if (quantidade <= 0) return removerProduto(id);

    setItens((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantidade } : p)),
    );
  };

  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  const totalValor = itens.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: itens,
        adicionarProduto,
        removerProduto,
        atualizarQuantidade,
        limparCarrinho,
        clearCart, // agora funciona
        totalItens,
        totalValor,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
