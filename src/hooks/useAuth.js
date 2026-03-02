import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const { usuario, login, logout, loading } = useContext(AuthContext);
  return {
    usuario,
    login,
    logout,
    isAuthenticated: !!usuario,
    loading,
  };
};