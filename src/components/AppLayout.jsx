import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SidebarDrawer from "./SidebarDrawer";
import { useAuth } from "../contexts/AuthContext";

export default function AppLayout() {
  const { loading } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  // ⛔ não renderiza layout enquanto auth carrega
  if (loading) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-100 to-green-100">
      {/* HEADER */}
      <Header abrirSidebar={() => setSidebarAberta(true)} />

      {/* CONTEÚDO */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar
          aberta={sidebarAberta}
          onClose={() => setSidebarAberta(false)}
        />

        {/* MAIN */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
