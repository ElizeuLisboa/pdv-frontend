import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

export default function NovoProduto() {
  const [formData, setFormData] = useState({
    title: "",
    categoria: "",
    description: "",
    price: "",
    imagemUrl: "",
    estoque: "",
    codigoBarras: "", // ✅ novo campo
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      if (file) data.append("imagem", file);

      const res = await api.post("/produtos", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Produto cadastrado com sucesso!");
      console.log("Produto criado:", res.data);

      setFormData({
        title: "",
        categoria: "",
        description: "",
        price: "",
        imagemUrl: "",
        estoque: "",
        codigoBarras: "",
      });
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao cadastrar produto.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Cadastro de Produto
      </h2>

      <label className="block mb-2">Título</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <label className="block mb-2">Descrição</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <label className="block mb-2">Preço (R$)</label>
      <input
        name="price"
        type="number"
        step="0.01"
        value={formData.price}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <label className="block mb-2">Estoque</label>
      <input
        name="estoque"
        type="number"
        value={formData.estoque}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        required
      />

      <label className="block mb-2">Categoria</label>
      <input
        name="categoria"
        value={formData.categoria}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        placeholder="Ex: Roupas Masculinas"
        required
      />

      <label className="block mb-2">Código de Barras (EAN/UPC)</label>
      <input
        name="codigoBarras"
        value={formData.codigoBarras}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        placeholder="Ex: 7894561237890"
      />

      <label className="block mb-2">Imagem do Produto (upload ou URL)</label>
      <input
        type="file"
        name="imagem"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-3"
      />

      <p className="text-center text-gray-500 mb-2">ou</p>

      <input
        type="text"
        name="imagemUrl"
        value={formData.imagemUrl}
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        placeholder="https://exemplo.com/imagem.jpg"
      />
      <div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Cadastrar Produto
        </button>
        <Link
          to="/"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Voltar à loja
        </Link>
      </div>
    </form>
  );
}

