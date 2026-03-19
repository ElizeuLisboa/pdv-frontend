import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

export default function Dashboard() {
  const [vendasPorProduto, setVendasPorProduto] = useState([]);
  const [pedidosPorStatus, setPedidosPorStatus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/dashboard/vendas-por-produto")
      .then((res) => setVendasPorProduto(res.data))
      .catch((err) => console.error(err));

    api
      .get("/dashboard/pedidos-por-status")
      .then((res) => setPedidosPorStatus(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Calcula a linha de tendência (simples média móvel)
  const calcularLinhaTendencia = (dados) => {
    if (!dados.length) return [];
    let somaAcumulada = 0;
    return dados.map((d, i) => {
      somaAcumulada += d.vendas;
      return { ...d, tendencia: somaAcumulada / (i + 1) };
    });
  };

  const vendasComTendencia = calcularLinhaTendencia(vendasPorProduto);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendas por Produto - Gráfico combinado com tendência */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Vendas por Produto</h2>
          {vendasPorProduto.length ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={vendasComTendencia}
                margin={{ top: 20, right: 40, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="produto" />
                <YAxis yAxisId="left" tickFormatter={(val) => `R$ ${val}`} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "vendas")
                      return [`R$ ${value.toFixed(2)}`, "Vendas"];
                    if (name === "qtdPedidos") return [value, "Qtd Pedidos"];
                    if (name === "tendencia")
                      return [`R$ ${value.toFixed(2)}`, "Tendência"];
                    return [value, name];
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                {/* Barras de quantidade de pedidos com gradiente */}
                <Bar
                  yAxisId="right"
                  dataKey="qtdPedidos"
                  name="Quantidade Pedidos"
                  fill="url(#gradPedidos)"
                  radius={[5, 5, 0, 0]}
                  animationDuration={800}
                />
                {/* Linha de vendas */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="vendas"
                  name="Total Vendas"
                  stroke="#FF8042"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  animationDuration={800}
                />
                {/* Linha de tendência */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tendencia"
                  name="Tendência"
                  stroke="#0088FE"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={1000}
                />
                {/* Definição de gradiente */}
                <defs>
                  <linearGradient id="gradPedidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#82ca9d" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Nenhuma venda registrada.</p>
          )}
        </div>

        {/* Pedidos por Status */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Pedidos por Status</h2>
          <button
            type="button"
            onClick={() => navigate("/produtos") }
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Voltar Pagina Inicial
          </button>
          {pedidosPorStatus.length ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pedidosPorStatus}
                  dataKey="quantidade"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                  animationDuration={800}
                >
                  {pedidosPorStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Nenhum pedido registrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
