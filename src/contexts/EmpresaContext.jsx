import { createContext, useContext, useState } from "react";

const EmpresaContext = createContext();

export function EmpresaProvider({ children }) {
  const [empresaSelecionada, setEmpresaSelecionada] = useState(
    Number(localStorage.getItem("empresaSelecionada")) || 1
  );

  const alterarEmpresa = (id) => {
    setEmpresaSelecionada(id);
    localStorage.setItem("empresaSelecionada", id);
  };

  return (
    <EmpresaContext.Provider
      value={{
        empresaSelecionada,
        setEmpresaSelecionada: alterarEmpresa,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  return useContext(EmpresaContext);
}