import { useEffect, useState } from "react";
import api from "../services/api";

export function useCategorias() {
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get("/produtos/familias");
        if (Array.isArray(data)) setFamilias(data);
      } catch (err) {
        console.error("Erro ao carregar famílias", err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return { familias, loading };
}
