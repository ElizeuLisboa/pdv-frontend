import { useNavigate } from "react-router-dom";
import { useFiltro } from "../contexts/FiltroContext";
import { useCategorias } from "../hooks/useCategorias";

export default function SelectCategorias() {
  const navigate = useNavigate();
  const { familias, loading } = useCategorias();
  const { familiaSelecionada, setFamiliaSelecionada, setBusca } = useFiltro();


  function handleChange(e) {
    const id = e.target.value || "";

    setFamiliaSelecionada(id);
    setBusca("");

    if (id) {
      navigate(`/produtos?familia=${id}`, { replace: true });
    } else {
      navigate({
        pathname: "/produtos",
        search: "",
      });
    }
  }

  if (loading) return null;

  return (
    <select
      value={familiaSelecionada || ""}
      onChange={handleChange}
      className="text-black p-2 rounded"
    >
      <option value="">Todos</option>

      {familias.map((fam) => (
        <option key={fam.id} value={fam.id}>
          {fam.nome}
        </option>
      ))}
    </select>
  );
}
