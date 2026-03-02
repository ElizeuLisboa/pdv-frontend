export default function PagamentoSucesso() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-green-600">
        Pagamento realizado com sucesso!
      </h1>

      <p className="mt-4 text-gray-600">
        Seu pedido foi confirmado.
      </p>

      <a
        href="/produtos"
        className="mt-6 bg-purple-700 text-white px-6 py-3 rounded"
      >
        Voltar à loja
      </a>
    </div>
  );
}
