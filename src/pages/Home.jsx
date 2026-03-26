// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import CardProduto from "../components/CardProduto";
// import { useFiltro } from "../contexts/FiltroContext";
// import CarrosselProdutos from "../components/CarrosselProdutos";

// export default function Home() {
//   const { categoriaSelecionada, busca } = useFiltro();
//   const [produtos, setProdutos] = useState([]);
//   const [categorias, setCategorias] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProdutos = async () => {
//       try {
//         setLoading(true);

//         const params = new URLSearchParams(location.search);
//         const familia = params.get("familia");
//         const nome = params.get("nome");

//         console.log("🔎 FILTROS:", { familia, nome });

//         const { data } = await api.get("/produtos", {
//           params: {
//             familia: familia || undefined,
//             nome: nome || undefined,
//           },
//         });

//         setProdutos(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Erro ao buscar produtos:", err);
//         setProdutos([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProdutos();
//   }, [location.search]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <span className="text-gray-500 text-lg animate-pulse">
//           Carregando produtos...
//         </span>
//       </div>
//     );
//   }

//   useEffect(() => {
//     const fetchCategorias = async () => {
//       try {
//         const { data } = await api.get("/produtos/categorias");
//         setCategorias(data || []);
//       } catch (err) {
//         console.error("Erro ao buscar categorias:", err);
//       }
//     };

//     fetchCategorias();
//   }, []);

//   // const getProdutosPorCategoria = (id) => {
//   //   return produtos.filter((p) => p.categoriaId === id);
//   // };

//   return (
//   <div className="max-w-7xl mx-auto p-4">
//     {/* 🔥 BANNER */}
//     <div className="bg-emerald-600 text-white p-4 rounded mb-6 text-center font-semibold">
//       🚚 Frete grátis acima de R$ 200 • 💳 Até 4x sem juros
//     </div>

//     {/* 🔥 MAIS VENDIDOS */}
//     <h2 className="text-xl font-bold mb-2">🔥 Mais Vendidos</h2>
//     <CarrosselProdutos produtos={produtos.slice(0, 10)} />

//     {/* 🔥 CATEGORIAS DINÂMICAS */}
//     {categorias.map((cat) => {
//       const produtosCategoria = produtos.filter(
//         (p) => p.categoriaId === cat.id,
//       );

//       if (produtosCategoria.length === 0) return null;

//       return (
//         <div key={cat.id}>
//           <h2 className="text-xl font-bold mt-6 mb-2 border-l-4 border-emerald-500 pl-2">
//             {cat.nome}
//           </h2>

//           <CarrosselProdutos produtos={produtosCategoria} />
//         </div>
//       );
//     })}
//   </div>
// );
// }

import React, { useEffect, useState } from "react";
import api from "../services/api";
import CarrosselProdutos from "../components/CarrosselProdutos";
import { useFiltro } from "../contexts/FiltroContext";

export default function Home() {
  const { categoriaSelecionada, busca } = useFiltro();

  // 🔥 TODOS OS HOOKS NO TOPO
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 BUSCAR PRODUTOS
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams(window.location.search);
        const familia = params.get("familia");
        const nome = params.get("nome");

        console.log("🔎 FILTROS:", { familia, nome });

        const { data } = await api.get("/produtos", {
          params: {
            familia: familia || undefined,
            nome: nome || undefined,
          },
        });

        setProdutos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [window.location.search]);

  // 🔥 BUSCAR CATEGORIAS
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await api.get("/produtos/categorias");
        setCategorias(data || []);
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
      }
    };

    fetchCategorias();
  }, []);

  // 🔥 AGORA SIM PODE TER IF
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg animate-pulse">
          Carregando produtos...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* 🔥 BANNER */}
      <div className="bg-emerald-600 text-white p-4 rounded mb-6 text-center font-semibold">
        🚚 Frete grátis acima de R$ 200 • 💳 Até 4x sem juros
      </div>

      {/* 🔥 MAIS VENDIDOS */}
      <h2 className="text-xl font-bold mb-2">🔥 Mais Vendidos</h2>
      <CarrosselProdutos produtos={produtos.slice(0, 10)} />

      {/* 🔥 CATEGORIAS DINÂMICAS */}
      {categorias.map((cat) => {
        const produtosCategoria = produtos.filter(
          (p) => p.categoriaId === cat.id,
        );

        if (produtosCategoria.length === 0) return null;

        return (
          <div key={cat.id}>
            <h2 className="text-xl font-bold mt-6 mb-2">{cat.nome}</h2>

            <CarrosselProdutos produtos={produtosCategoria} />
          </div>
        );
      })}
    </div>
  );
}
