// import React, { useState, useEffect, useRef } from "react";
// import api from "../services/api";

// export default function InputBusca({ busca, setBusca }) {
//   const [query, setQuery] = useState(busca || "");
//   const [sugestoes, setSugestoes] = useState([]);
//   const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     setQuery(busca || "");
//   }, [busca]);

//   // Função de debounce
//   useEffect(() => {
//     if (query.trim() === "") {
//       setSugestoes([]);
//       return;
//     }

//     if (timeoutRef.current) clearTimeout(timeoutRef.current);

//     timeoutRef.current = setTimeout(async () => {
//       try {
//         const { data } = await api.get(`/produtos?nome=${encodeURIComponent(query)}`);
//         setSugestoes(data || []);
//         setMostrarSugestoes(true);
//       } catch (err) {
//         console.error("Erro ao buscar sugestões:", err);
//       }
//     }, 300); // 300ms debounce
//   }, [query]);

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//     setBusca(e.target.value);
//   };

//   const handleClickSugestao = (nome) => {
//     setQuery(nome);
//     setBusca(nome);
//     setMostrarSugestoes(false);
//   };

//   const handleBlur = () => {
//     // esconde sugestões após 200ms para permitir clique
//     setTimeout(() => setMostrarSugestoes(false), 200);
//   };

//   return (
//     <div className="relative w-full">
//       <input
//         type="text"
//         value={query}
//         onChange={handleChange}
//         onFocus={() => setMostrarSugestoes(true)}
//         onBlur={handleBlur}
//         placeholder="Buscar produto..."
//         className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
//       />
//       {mostrarSugestoes && sugestoes.length > 0 && (
//         <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-60 overflow-auto shadow-lg">
//           {sugestoes.map((produto) => (
//             <li
//               key={produto.id}
//               className="px-3 py-2 hover:bg-amber-100 cursor-pointer"
//               onClick={() => handleClickSugestao(produto.title)}
//             >
//               {produto.title}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useFiltro } from "../contexts/FiltroContext";


export default function InputBusca() {
  const { busca, setBusca } = useFiltro();
  const [query, setQuery] = useState(busca || "");

  useEffect(() => {
    setQuery(busca || "");
  }, [busca]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setBusca(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Buscar produto..."
      autoComplete="off"
      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-amber-500 text-black"
    />
  );
}
