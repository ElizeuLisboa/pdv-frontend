// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import CardProduto from "./CardProduto";

// const ProdutosPorCategoria = () => {
//   const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchProdutos() {
//       try {
//         const { data } = await api.get("/produtos");
//         const agrupados = data.reduce((acc, produto) => {
//           const categoria = produto.categoria || "Outros";
//           if (!acc[categoria]) acc[categoria] = [];
//           acc[categoria].push(produto);
//           return acc;
//         }, {});
//         setProdutosPorCategoria(agrupados);
//       } catch (error) {
//         console.error("Erro ao buscar produtos:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProdutos();
//   }, []);

//   if (loading) return <p className="text-center p-4">Carregando produtos...</p>;

//   return (
//     <div className="space-y-8 p-4">
//       {Object.entries(produtosPorCategoria).map(([categoria, produtos]) => (
//         <div key={categoria}>
//           <h3 className="text-xl font-bold mb-4">{categoria}</h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {produtos.map((produto) => (
//               <CardProduto key={produto.id} produto={produto} />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ProdutosPorCategoria;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import CardProduto from "./CardProduto";

const ProdutosPorCategoria = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function fetchProdutos() {
      setLoading(true);

      const params = new URLSearchParams(location.search);
      const familia = params.get("familia");

      try {
        const { data } = await api.get("/produtos", {
          params: familia ? { familia } : {},
        });

        setProdutos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  }, [location.search]);

  if (loading) {
    return <p className="text-center p-4">Carregando produtos...</p>;
  }

  if (produtos.length === 0) {
    return <p className="text-center p-4">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {produtos.map((produto) => (
        <CardProduto key={produto.id} produto={produto} />
      ))}
    </div>
  );
};

export default ProdutosPorCategoria;
