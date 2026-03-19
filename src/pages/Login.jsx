import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect");
  // const API_URL = import.meta.env.VITE_API_URL; // ◄◄ antes estava declarado aqui, mas movi para o topo para manter a consistência com os outros arquivos  

  console.log("API URL:", api.defaults.baseURL);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Resposta do login:", response.data);
      

      const token = response.data.jwt;
      const usuario = response.data.cliente;

      if (!token) {
        throw new Error("Token não recebido");
      }

      // salva token
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // atualiza contexto
      login(usuario, token);

      toast.success("Login realizado com sucesso!");

      if (usuario.role === "CAIXA") {
        navigate("/caixa");
      } else if (usuario.role === "ADMIN" || usuario.role === "SUPERUSER") {
        navigate("/dashboard");
      } else {
        navigate("/produtos", { replace: true });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700"
        >
          Entrar
        </button>

        <p className="text-center mt-4 text-sm text-gray-700">
          Não tem conta?
          <Link
            to="/cadastro"
            className="text-amber-600 font-semibold hover:underline"
          >
            Cadastre-se aqui
          </Link>
        </p>
      </form>
    </div>
  );
}
