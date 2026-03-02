import { createContext, useContext, useState } from "react";

export const FiltroContext = createContext({
  categoriaSelecionada: "",
  familiaSelecionada: "",
  busca: "",
  setCategoriaSelecionada: () => {},
  setFamiliaSelecionada: () => {},
  setBusca: () => {},
});

export function FiltroProvider({ children }) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [familiaSelecionada, setFamiliaSelecionada] = useState("");
  const [busca, setBusca] = useState("");

  return (
    <FiltroContext.Provider
      value={{
        categoriaSelecionada,
        setCategoriaSelecionada,
        familiaSelecionada,
        setFamiliaSelecionada,
        busca,
        setBusca,
      }}
    >
      {children}
    </FiltroContext.Provider>
  );
}

export function useFiltro() {
  return useContext(FiltroContext);
}
