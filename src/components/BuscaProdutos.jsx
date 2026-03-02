import { useEffect, useState } from "react";
import { useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function BuscaProdutos() {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({});
  const navigate = useNavigate();

  // 🔹 Carregar categorias
  useEffect(() => {
    async function carregarCategorias() {
      try {
        const { data } = await api.get("/produtos/categorias");
        if (Array.isArray(data)) {
          setCategorias(data);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    }
    carregarCategorias();
  }, []);

  useEffect(() => {
    if (!termo || termo.length < 2) {
      setSugestoes([]);
      return;
    }

    // 🔹 Cache local
    if (cacheRef.current[termo]) {
      setSugestoes(cacheRef.current[termo]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const { data } = await api.get(`/produtos?nome=${termo}`);

        if (!Array.isArray(data)) return;

        const termoLower = termo.toLowerCase();

        // 🔹 Prioriza quem começa com o termo
        const startsWith = [];
        const contains = [];

        data.forEach((p) => {
          const nome = (p.title || p.nome || "").toLowerCase();

          if (nome.startsWith(termoLower)) {
            startsWith.push(p);
          } else if (nome.includes(termoLower)) {
            contains.push(p);
          }
        });

        const resultado = [...startsWith, ...contains].slice(0, 5);

        cacheRef.current[termo] = resultado;
        setSugestoes(resultado);
      } catch {
        setSugestoes([]);
      }
    }, 300); // debounce real

    return () => clearTimeout(timeout);
  }, [termo]);

  // 🔹 Submit normal
  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (categoria) params.append("familia", categoria);
    if (termo) params.append("nome", termo);

    navigate(`/produtos${params.toString() ? `?${params}` : ""}`);
  };

  // 🔹 Clique em sugestão
  const handleSelect = (produto) => {
    setTermo(produto.title || produto.nome);
    setSugestoes([]);
    navigate(`/produtos/${produto.id}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "1rem", position: "relative", display: "flex" }}
    >
      {/* Select categorias */}
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      >
        <option value="">Todas as categorias</option>

        {loading && <option disabled>Carregando...</option>}

        {!loading &&
          categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
      </select>

      {/* Input busca */}
      <div style={{ position: "relative", flexGrow: 1 }}>
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem", width: "100%" }}
        />

        {/* 🔽 Sugestões */}
        {sugestoes.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ddd",
              borderTop: "none",
              zIndex: 1000,
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {sugestoes.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  padding: "0.5rem",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#f2f2f2")}
                onMouseLeave={(e) => (e.target.style.background = "#fff")}
              >
                {p.title || p.nome}
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" style={{ padding: "0.5rem 1rem" }}>
        Buscar
      </button>
    </form>
  );
}
