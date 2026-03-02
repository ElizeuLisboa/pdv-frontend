// hooks/useBuscarProdutos.js
import { useState } from "react";
import api from "../services/api";

export function useBuscarProdutos() {
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);

  const buscar = async (categoria = "", nome = "") => {
    try {
      setLoading(true);
      setErro(null);

      const response = await api.get("/produtos", {
        params: { categoria, nome },
      });
      //console.log("👉 Resposta da API:", response.data); // 👈 confere o que chega
      setProdutos(response.data);

      return response.data;
    } catch (err) {
      setErro("Erro ao buscar produtos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { produtos, loading, erro, buscar };
}
