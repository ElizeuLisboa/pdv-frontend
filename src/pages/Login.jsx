import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { setEmpresaSelecionadaGlobal } from "../services/empresaStore";

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 LIMPA TUDO (ANTES DO LOGIN)
      logout(); // limpa contexto
      localStorage.clear(); // limpa storage
      setEmpresaSelecionadaGlobal(null); // limpa store global

      const response = await api.post("/auth/login-unificado", {
        login: loginInput,
        password,
      });

      const { token, user, tipo } = response.data;

      if (!token || !user) {
        toast.error("Falha no login");
        return;
      }

      // 🔐 salva sessão corretamente
      login(user, token);

      // 🔥 se for usuário, define empresa padrão
      if (tipo === "usuario" && user.empresaId) {
        setEmpresaSelecionadaGlobal(user.empresaId);
        localStorage.setItem("empresaSelecionada", user.empresaId);
      }

      toast.success("Login realizado com sucesso!");

      // 🔀 redirecionamento
      if (tipo === "cliente") {
        navigate("/produtos", { replace: true });
        return;
      }

      if (user.role === "CAIXA") {
        navigate("/caixa", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Digite seu email, telefone ou nome"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700">
          Entrar
        </button>

        <p className="text-center text-sm">
          Não tem conta?
          <Link to="/cadastro" className="text-amber-600 font-semibold ml-1">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}