// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../contexts/AuthContext";
// import api from "../services/api";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [tipo, setTipo] = useState("cliente"); // cliente | usuario

//   const { login } = useAuth(); // ✅ CORRETO
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     localStorage.clear();
//     try {
//       const url = tipo === "cliente" ? "/auth/login" : "/usuario/login";

//       const response = await api.post(url, {
//         email,
//         password,
//       });

//       // 🛒 CLIENTE
//       if (tipo === "cliente") {
//         const token = response.data.jwt;
//         const cliente = response.data.cliente;

//         login(cliente, token); // ✅ usa o contexto

//         localStorage.setItem("cliente", JSON.stringify(cliente));

//         toast.success("Login de cliente realizado!");

//         navigate("/produtos", { replace: true });
//         return;
//       }

//       // 🏢 USUÁRIO (ADMIN / CAIXA / SUPERUSER)
//       //const usuario = response.data;

//       const usuario = response.data.usuario;
//       const token = response.data.token || response.data.jwt;

//       if (!token) {
//         toast.error("Token não recebido do servidor");
//         return;
//       }

//       login(usuario, token); // ✅ agora correto

//       localStorage.setItem("empresaId", usuario.empresaId);

//       toast.success("Login administrativo realizado!");

//       if (usuario.role === "CAIXA") {
//         navigate("/caixa", { replace: true });
//       } else {
//         navigate("/dashboard", { replace: true });
//       }
//     } catch (error) {
//       console.error("Erro no login:", error);
//       toast.error("Credenciais inválidas");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

//       {/* 🔥 SELETOR */}
//       <div className="flex mb-6 border rounded overflow-hidden">
//         <button
//           type="button"
//           onClick={() => setTipo("cliente")}
//           className={`flex-1 py-2 ${
//             tipo === "cliente" ? "bg-amber-600 text-white" : "bg-gray-100"
//           }`}
//         >
//           🛒 Cliente
//         </button>

//         <button
//           type="button"
//           onClick={() => setTipo("usuario")}
//           className={`flex-1 py-2 ${
//             tipo === "usuario" ? "bg-indigo-600 text-white" : "bg-gray-100"
//           }`}
//         >
//           🏢 Painel
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Seu e-mail"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border px-4 py-2 rounded"
//           required
//         />

//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Sua senha"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border px-4 py-2 rounded"
//             required
//           />
//           <button
//             type="button"
//             className="absolute right-2 top-1/2 -translate-y-1/2"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>

//         <button className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700">
//           Entrar
//         </button>

//         {tipo === "cliente" && (
//           <p className="text-center text-sm">
//             Não tem conta?
//             <Link to="/cadastro" className="text-amber-600 font-semibold ml-1">
//               Cadastre-se
//             </Link>
//           </p>
//         )}
//       </form>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 limpa sessão antiga
    localStorage.clear();

    try {
      const response = await api.post("/auth/login-unificado", {
        login: loginInput,
        password,
      });

      const { token, user, tipo } = response.data;

      if (!token) {
        toast.error("Token não recebido");
        return;
      }

      // 🔐 salva sessão
      login(user, token);

      toast.success("Login realizado com sucesso!");

      // 🔀 redirecionamento inteligente
      if (tipo === "cliente") {
        navigate("/produtos", { replace: true });
        return;
      }

      // 🏢 usuário do sistema
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
        {/* 🔥 INPUT UNIFICADO */}
        <input
          type="text"
          placeholder="Digite seu email, telefone ou nome"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />

        {/* 🔒 SENHA */}
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

        {/* 🔗 CADASTRO SEMPRE VISÍVEL */}
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
