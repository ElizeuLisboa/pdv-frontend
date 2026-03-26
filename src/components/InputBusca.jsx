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
