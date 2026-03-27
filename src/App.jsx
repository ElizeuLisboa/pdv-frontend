import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { FiltroProvider } from "./contexts/FiltroContext";

import { RoleRedirector } from "./utils/RoleRedirector";
import AppLayout from "./components/AppLayout";
import ScrollToTop from "./components/ScrollToTop";

// import { RequireAuth } from "./components/RequireAuth";
import RequireAuth from "./components/RequireAuth";
import RequireRole from "./components/RequireRole";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import DetalhesProduto from "./pages/DetalhesProduto";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import NovoCliente from "./pages/NovoCliente";
import NovoProduto from "./pages/NovoProduto";
import Transportadoras from "./pages/Transportadoras";
import Carrinho from "./pages/Carrinho";
import PedidosUsuario from "./pages/PedidosUsuario";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Apresentacao from "./pages/Apresentacao";

import CaixaLayout from "./components/CaixaLayout";

import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import CaixaLojaComponent from "./components/CaixaLoja";
import AdminPage from "./pages/Admin";
import EditarCliente from "./pages/EditarCliente";
import AcessoNegado from "./pages/AcessoNegado";
import Sucesso from "./pages/Sucesso";
import CadastroClienteSite from "./pages/CadastroClienteSite";
import PedidoDetalhe from "./pages/PedidoDetalhe";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FiltroProvider>
          <Router>
            <ScrollToTop />
            <RoleRedirector />

            <Routes>
              {/* 🔒 ÁREA PRINCIPAL (SITE) */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                {/* <Route path="/produtos" element={<Produtos />} /> */}
                <Route path="/produtos" element={<Home />} />
                <Route path="/produtos/:id" element={<DetalhesProduto />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/Sucesso" element={<Sucesso />} />
                <Route path="/pedido/:id" element={<PedidoDetalhe />} />
                <Route path="/cadastro" element={<CadastroClienteSite />} />

                <Route
                  path="/pedidos/meus"
                  element={
                    <RequireAuth>
                      <PedidosUsuario />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/produtos/novo"
                  element={
                    <RequireAuth>
                      <RequireRole roles={["ADMIN", "SUPERUSER"]}>
                        <NovoProduto />
                      </RequireRole>
                    </RequireAuth>
                  }
                />

                <Route
                  path="/clientes"
                  element={
                    <RequireAuth>
                      <RequireRole roles={["ADMIN", "SUPERUSER"]}>
                        <Clientes />
                      </RequireRole>
                    </RequireAuth>
                  }
                />

                <Route
                  path="/clientes/novo"
                  element={
                    <RequireAuth>
                      <RequireRole roles={["ADMIN", "SUPERUSER"]}>
                        <NovoCliente />
                      </RequireRole>
                    </RequireAuth>
                  }
                />

                <Route
                  path="/clientes/:id/editar"
                  element={
                    <RequireAuth>
                      <RequireRole roles={["ADMIN", "SUPERUSER"]}>
                        <EditarCliente />
                      </RequireRole>
                    </RequireAuth>
                  }
                />

                <Route
                  path="/transportadoras"
                  element={
                    <RequireAuth>
                      <RequireRole roles={["ADMIN", "SUPERUSER"]}>
                        <Transportadoras />
                      </RequireRole>
                    </RequireAuth>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth roles={["ADMIN", "SUPERUSER"]}>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
              </Route>

              {/* 🔓 ROTAS PÚBLICAS */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/apresentacao" element={<Apresentacao />} />
              <Route path="/acesso-negado" element={<AcessoNegado />} />

              {/* 🧾 PDV / CAIXA */}
              <Route
                path="/caixa"
                element={
                  <RequireAuth caixa>
                    <CaixaLayout>
                      <CaixaLojaComponent />
                    </CaixaLayout>
                  </RequireAuth>
                }
              />

              <Route
                path="/caixa-admin"
                element={
                  <RequireAuth admin>
                    <CaixaLayout>
                      <AdminPage />
                    </CaixaLayout>
                  </RequireAuth>
                }
              />
            </Routes>

            <ToastContainer />
            <Footer />
          </Router>
        </FiltroProvider>
      </CartProvider>
    </AuthProvider>
  );
}
