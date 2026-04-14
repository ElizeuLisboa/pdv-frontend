import { createContext, useContext, useState } from "react";

const EmpresaContext = createContext();

export function EmpresaProvider({ children }) {
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  return (
    <EmpresaContext.Provider
      value={{ empresaSelecionada, setEmpresaSelecionada }}
    >
      {children}
    </EmpresaContext.Provider>
  );
}

export function useEmpresa() {
  return useContext(EmpresaContext);
}