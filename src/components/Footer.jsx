// import React from 'react';

// export default function Footer() {
//   return (
//     <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-20">
//       &copy; 2025 Minha Loja. Todos os direitos reservados.
//     </footer>
//   );
// }

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-3">
        <h3 className="text-lg font-semibold text-white">
          UseAltara © 2026
        </h3>

        <p className="text-sm">
          Todos os direitos reservados.
        </p>

        <p className="text-sm text-yellow-300">
          ⚠️ Sistema em fase final de implantação
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
          <a
            href="/politica-de-privacidade"
            className="hover:text-white transition"
          >
            Política de Privacidade
          </a>

          <a
            href="https://wa.me/5511970183203"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Contato / WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}