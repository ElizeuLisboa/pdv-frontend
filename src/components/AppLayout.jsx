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
    <div className="flex min-h-screen flex-col">
      <Header abrirSidebar={() => setSidebarAberta(true)} />

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <Sidebar
            aberta={true}
            onClose={() => setSidebarAberta(false)}
          />
        </div>

        {/* Sidebar mobile */}
        <SidebarDrawer
          aberta={sidebarAberta}
          onClose={() => setSidebarAberta(false)}
        />

        <main className="flex-1 p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

