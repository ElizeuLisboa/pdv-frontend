import React from "react";
import CardProduto from "./CardProduto";

export default function CarrosselProdutos({ produtos, titulo }) {
  return (
    <div className="mb-8">
      
      <h2 className="text-xl font-bold mb-4 px-2">{titulo}</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">

        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="min-w-[300px] max-w-[220px] flex-shrink-0"
          >
            <CardProduto produto={produto} />
          </div>
        ))}

      </div>
    </div>
  );
}