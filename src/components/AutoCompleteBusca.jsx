import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useFiltro } from "../contexts/FiltroContext";
import { produtoCache, isCacheValido } from "../cache/produtoCache";

export default function AutoCompleteBusca() {
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { categoriaSelecionada } = useFiltro();
  const navigate = useNavigate();
  const cacheRef = useRef({});

  const produtoCache = {};

  useEffect(() => {
    if (!termo || termo.length < 2) {
      setSugestoes([]);
      return;
    }

    const cacheKey = `${categoriaSelecionada || "all"}-${termo}`;

    if (cacheRef.current[cacheKey]) {
      setSugestoes(cacheRef.current[cacheKey]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();
        query.append("nome", termo);

        if (categoriaSelecionada) {
          query.append("familia", categoriaSelecionada);
        }

        const { data } = await api.get(`/produtos?${query.toString()}`);

        if (!Array.isArray(data)) return;

        const termoLower = termo.toLowerCase();
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

        cacheRef.current[cacheKey] = resultado;
        setSugestoes(resultado);
      } catch {
        setSugestoes([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [termo, categoriaSelecionada]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termo) return;

    const params = new URLSearchParams();
    params.append("nome", termo);

    if (categoriaSelecionada) {
      params.append("familia", categoriaSelecionada);
    }

    navigate(`/produtos?${params.toString()}`);
    setSugestoes([]);
  };

  const handleSelect = (produto) => {
    navigate(`/produtos/${produto.id}`);
    setSugestoes([]);
  };

  const preloadProduto = async (id) => {
    if (isCacheValido(id)) return;

    try {
      const { data } = await api.get(`/produtos/${id}`);
      produtoCache[id] = {
        data,
        timestamp: Date.now(),
      };
    } catch {}
  };


  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar produtos..."
          className="w-full p-2 rounded text-black"
        />
      </form>

      {sugestoes.length > 0 && (
        <ul className="absolute z-50 bg-white w-full border rounded shadow mt-1 max-h-60 overflow-auto">
          {sugestoes.map((p) => (
            <li
              key={p.id}
              onMouseEnter={() => preloadProduto(p.id)}
              onClick={() => handleSelect(p)}
              className="px-3 py-2 hover:bg-amber-100 cursor-pointer text-sm text-black"
            >
              {p.title || p.nome}
            </li>
            // <li
            //   key={p.id}
            //   onClick={() => handleSelect(p)}
            //   className="px-3 py-2 hover:bg-amber-100 cursor-pointer text-sm text-black"
            // >
            //   {p.title || p.nome}
            // </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="absolute right-2 top-2 text-xs text-gray-400">
          buscando...
        </div>
      )}
    </div>
  );
}
