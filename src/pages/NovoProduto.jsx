import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

export default function NovoProduto() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imagemUrl: "",
    estoque: "",
    codigoBarras: "", // ✅ novo campo
  });

  const [file, setFile] = useState(null);

  // 🔥 AQUI
  const [unidades, setUnidades] = useState([
    {
      tipo: "UN",
      fator: 1,
      preco: "",
    },
  ]);
  const [familias, setFamilias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [familiaId, setFamiliaId] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        const { data } = await api.get("/produtos/familias");
        setFamilias(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFamilias();
  }, []);

  useEffect(() => {
    if (!familiaId) return;

    const fetchGrupos = async () => {
      try {
        const { data } = await api.get(`/produtos/grupos/${familiaId}`);
        setGrupos(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGrupos();
  }, [familiaId]);

  useEffect(() => {
    console.log("Grupo selecionado:", grupoId);
    if (!grupoId) return;

    const fetchCategorias = async () => {
      try {
        const { data } = await api.get(`/produtos/categorias/${grupoId}`);
        setCategorias(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategorias();
  }, [grupoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnidadeChange = (index, field, value) => {
    const novasUnidades = [...unidades];
    novasUnidades[index][field] = value;
    setUnidades(novasUnidades);
  };

  const adicionarUnidade = () => {
    setUnidades([
      ...unidades,
      {
        tipo: "",
        fator: 1,
        preco: "",
      },
    ]);
  };

  const removerUnidade = (index) => {
    const novasUnidades = unidades.filter((_, i) => i !== index);
    setUnidades(novasUnidades);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // 🔥 campos principais
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      // 🔥 imagem upload
      if (file) {
        data.append("imagem", file);
      }

      // 🔥 categoria correta
      data.append("categoriaId", categoriaId);

      // 🔥 unidades (MUITO IMPORTANTE)
      data.append("unidades", JSON.stringify(unidades));

      console.log("TOKEN:", token);
      console.log("UNIDADES:", unidades);
      console.log("CATEGORIA ID:", categoriaId);

      const res = await api.post("/produtos", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Produto cadastrado com sucesso!");
      console.log("Produto criado:", res.data);

      // 🔥 reset completo
      setFormData({
        title: "",
        description: "",
        price: "",
        imagemUrl: "",
        estoque: "",
        codigoBarras: "",
      });

      setFamiliaId("");
      setGrupoId("");
      setCategoriaId("");

      setGrupos([]);
      setCategorias([]);

      setUnidades([
        {
          tipo: "UN",
          fator: 1,
          preco: "",
        },
      ]);

      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao cadastrar produto.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Cadastro de Produto
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🔥 CONTAINER ESQUERDO */}
        <div className="bg-gradient-to-br from-white to-amber-50 border border-amber-100 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-amber-700 border-b pb-2">
            Dados Principais
          </h3>

          <label className="block mb-2 font-medium">Título</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />

          <label className="block mb-2 font-medium">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            rows={4}
            required
          />

          <label className="block mb-2 font-medium">Preço (R$)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />

          <label className="block mb-2 font-medium">Estoque</label>
          <input
            name="estoque"
            type="number"
            value={formData.estoque}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />

          <label className="block mb-2 font-medium">
            Código de Barras (EAN/UPC)
          </label>
          <input
            name="codigoBarras"
            value={formData.codigoBarras}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ex: 7894561237890"
          />

          <label className="block mb-2 font-medium">
            Imagem do Produto (upload ou URL)
          </label>

          <input
            type="file"
            name="imagem"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />

          <p className="text-center text-gray-500 mb-3">ou</p>

          <input
            type="text"
            name="imagemUrl"
            value={formData.imagemUrl}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        {/* 🔥 CONTAINER DIREITO */}
        <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-blue-700 border-b pb-2">
            Estrutura do Produto
          </h3>

          <label className="block mb-2 font-medium">Família</label>
          <select
            value={familiaId}
            onChange={(e) => {
              setFamiliaId(e.target.value);
              setGrupoId("");
              setCategoriaId("");
              setGrupos([]);
              setCategorias([]);
            }}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecione a Família</option>

            {familias.map((familia) => (
              <option key={familia.id} value={familia.id}>
                {familia.nome}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Grupo</label>
          <select
            value={grupoId}
            onChange={(e) => {
              setGrupoId(e.target.value);
              setCategoriaId("");
              setCategorias([]);
            }}
            className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={!familiaId}
          >
            <option value="">Selecione o Grupo</option>

            {grupos.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nome}
              </option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full border p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled={!grupoId}
          >
            <option value="">Selecione a Categoria</option>

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>

          <div className="p-4 bg-white rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Unidades do Produto
            </h3>

            {unidades.map((u, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end"
              >
                <div>
                  <label className="block text-sm mb-1">Tipo</label>
                  <input
                    value={u.tipo}
                    onChange={(e) =>
                      handleUnidadeChange(index, "tipo", e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    placeholder="UN / PACOTE / CX"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Fator</label>
                  <input
                    type="number"
                    value={u.fator}
                    onChange={(e) =>
                      handleUnidadeChange(index, "fator", e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    value={u.preco}
                    onChange={(e) =>
                      handleUnidadeChange(index, "preco", e.target.value)
                    }
                    className="w-full border p-2 rounded"
                    placeholder="8.00"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removerUnidade(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remover
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={adicionarUnidade}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              + Adicionar Unidade
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 BOTÕES */}
      <div className="mt-8 space-y-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
        >
          Cadastrar Produto
        </button>

        <Link
          to="/"
          className="block text-center w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl shadow-md transition"
        >
          Voltar à Loja
        </Link>
      </div>
    </form>
  );
}
