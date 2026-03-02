// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function Apresentacao() {
//   const navigate = useNavigate();


//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
//       <img
//        src="/apresentacao.png"
//        alt="Bem-vindo à loja"
//        className="w-full max-w-5xl max-h-[240px] object-cover rounded shadow-md"
//       />
//       <h1 className="text-3xl font-bold mt-6 text-gray-800">
//         Seja bem-vindo à nossa loja!
//       </h1>
//       <p className="text-gray-600 mt-2 text-center max-w-xl">
//         Aqui você encontra os melhores produtos com os melhores preços. 
//         Você será redirecionado em instantes...
//       </p>
//       <button
//         onClick={() => navigate("/produtos")}
//         className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
//       >
//         Ir agora para os Produtos
//       </button>
//     </div>
//   );
// }

// import React from "react";

// export default function ApresentacaoCaixa() {
//   const usuario = localStorage.getItem("usuario")
//     ? JSON.parse(localStorage.getItem("usuario"))
//     : null;

//   return (
//     <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-purple-50 via-purple-100 to-white rounded-lg shadow-inner p-6">
//       <img
//         src="/apresentacao.png"
//         alt="Tela de Apresentação"
//         className="h-32 w-auto mb-6 object-contain opacity-90"
//       />
//       <h2 className="text-2xl font-bold text-purple-800 mb-2">
//         Olá, {usuario?.nome || "Operador"} 👋
//       </h2>
//       <p className="text-gray-600 text-lg text-center max-w-md">
//         O caixa está pronto para registrar vendas.  
//         Clique em <strong>Caixa</strong> no menu lateral para iniciar.
//       </p>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Apresentacao() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-100 to-amber-300">
      <img
        src="/apresentacao.png"
        alt="Apresentação"
        className="w-48 h-48 object-contain mb-6"
      />
      <h1 className="text-3xl font-bold text-amber-800 mb-4">
        Bem-vindo à Loja Roberta
      </h1>
      <button
        onClick={() => navigate("/login")}
        className="bg-amber-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-amber-700 transition"
      >
        Entrar no Caixa
      </button>
    </div>
  );
}
