const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ProdutosGrid({ produtos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {produtos?.map((produto) => (
        <div key={produto.id} className="border p-2 rounded shadow">
          <img
            src={
              produto.image.startsWith("http")
                ? produto.image
                : `${API_URL}${produto.image}`
            }
            alt={produto.title}
          />
          <h3 className="font-bold">{produto.nome}</h3>
          <p>R$ {produto.preco}</p>
        </div>
      ))}
    </div>
  );
}
