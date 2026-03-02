import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext({
  usuario: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
  isAutenticado: false,
});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsuario = localStorage.getItem("usuario");

    if (storedToken && storedUsuario) {
      setToken(storedToken);
      setUsuario(JSON.parse(storedUsuario));
    }
    setLoading(false);
  }, []);

  const login = (usuario, token) => {
    if (!token || !usuario) return;

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setToken(token);
    setUsuario(usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  };

  const isAutenticado = !!usuario;

  return (
    <AuthContext.Provider
      value={{ usuario, token, login, logout, loading, isAutenticado }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
