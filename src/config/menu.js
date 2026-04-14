export const menuItems = [
  { label: "🏠 Início", path: "/" },
  { label: "🛍️ Produtos", path: "/produtos" },
  { label: "🛒 Carrinho", path: "/carrinho" },
  { label: "📦 Meus Pedidos", path: "/pedidos/meus", auth: true },

  { label: "👥 Clientes", path: "/clientes", admin: true },
  { label: "➕ Novo Produto", path: "/produtos/novo", admin: true },
  { label: "🚚 Transportadoras", path: "/transportadoras", admin: true },
  { label: "📊 Dashboard", path: "/dashboard", admin: true },
];