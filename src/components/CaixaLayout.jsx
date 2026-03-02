import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CaixaLojaComponent from "./CaixaLoja";
import { useAuth } from "../contexts/AuthContext";
import { ACOES_AUDITORIA } from "../constants/auditoriaAcoes";
import ModalAutorizacao from "../components/caixa/ModalAutorizacao"; // <-- IMPORTANTE

export default function CaixaLayout() {
  const navigate = useNavigate();

  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  const { logout, usuario } = useAuth();

  const [acaoSelecionada, setAcaoSelecionada] = useState("SANGRIA");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Atualiza relógio + configura fullscreen e remove scroll
  useEffect(() => {
    const interval = setInterval(
      () => setHora(new Date().toLocaleTimeString()),
      1000,
    );

    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";

    return () => clearInterval(interval);
  }, []);

  // === TECLA F4 -> abre ModalAutorizacao ===
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "F4") {
        e.preventDefault();
        setShowAuthModal(true);
      }
    };

    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, []);

  const operadorNome = localStorage.getItem("usuario")
    ? JSON.parse(localStorage.getItem("usuario")).nome
    : "—";

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-purple-300 via-purple-200 to-white">
      {/* === FAIXA SUPERIOR === */}
      <header className="flex items-center justify-between bg-white shadow-md px-6 py-3">
        <div className="flex items-center gap-4">
          <img
            src="/LogoRoberta.jpg"
            alt="Logo"
            className="h-16 w-auto object-contain"
          />

          <div>
            <h1 className="text-xl font-semibold text-purple-800">
              PDV - Caixa
            </h1>

            <p className="text-sm text-gray-600">
              Operador: <span className="font-semibold">{operadorNome}</span>
            </p>

            {/* BADGES DE ATALHOS */}
            <div className="flex gap-4 mt-2">
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-md text-sm font-semibold">
                F2 – Pagamento
              </span>

              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-md text-sm font-semibold">
                F3 – Cadastro Rápido
              </span>

              {/* SELECT DE AÇÕES DE AUDITORIA */}
              <select
                className="border rounded px-2 py-1 text-sm"
                value={acaoSelecionada}
                onChange={(e) => setAcaoSelecionada(e.target.value)}
              >
                {ACOES_AUDITORIA.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>

              {/* Botão manual para abertura do modal */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1 bg-orange-500 text-white rounded-md font-semibold"
              >
                F4 – Autorizar
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500">Hora atual</div>
            <div className="font-mono text-lg font-semibold text-purple-700">
              {hora}
            </div>
          </div>

          {usuario?.role !== "CAIXA" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              ⬅ Voltar para o sistema
            </button>
          )}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Encerrar Caixa
          </button>

          <button
            onClick={() => navigate("/apresentacao")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>
      </header>

      {/* === CONTEÚDO PRINCIPAL === */}
      <main className="flex-1 overflow-hidden p-4">
        <CaixaLojaComponent />
      </main>

      {/* === MODAL DE AUTORIZAÇÃO === */}
      <ModalAutorizacao
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        operador={usuario}
        acao={acaoSelecionada}
      />
    </div>
  );
}
