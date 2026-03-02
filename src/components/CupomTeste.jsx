import React from "react";
import { toast } from "react-toastify";

export default function CupomTeste({ pedido, onClose }) {
  if (!pedido) {
    return <div>Nenhum pedido para exibir</div>;
  }

  const empresa = pedido.empresa ?? {
    nome: "SUA EMPRESA AQUI",
    cnpj: "00.000.000/0001-00",
    endereco: "",
    telefone: "",
    mensagemCupom: "",
  };

  const total = Number(
    pedido.valorTotal ||
    pedido.totalComJuros ||
    pedido.total ||
    0
  );

  const impostoFederal = total * 0.0685;
  const impostoEstadual = total * 0.18;

  const forma = pedido.metodoPagamento || "NÃO INFORMADO";

  const imprimirApenasCupom = () => {
    const conteudo = document.getElementById("area-cupom").innerHTML;
    const janela = window.open("", "", "width=400,height=800");

    janela.document.write(`
      <html>
      <head>
        <style>
          body {
            font-family: monospace;
            font-size: 12px;
            width: 58mm;
            margin: 0;
            padding: 4px;
          }
          .centro { text-align: center; }
          .linha { border-top: 1px dashed #000; margin: 4px 0; }
          .item { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        ${conteudo}
      </body>
      </html>
    `);

    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();

    toast.success("Cupom enviado para impressão");
  };

  const finalizar = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        id="area-cupom"
        style={{
          width: "58mm",
          fontFamily: "monospace",
          fontSize: "12px",
          margin: "auto",
        }}
      >
        <div className="centro">
          <strong>{empresa.nome}</strong>
          <br />
          CNPJ: {empresa.cnpj}
          <br />
          {empresa.endereco}
          <br />
          Tel: {empresa.telefone}
        </div>

        <div className="linha" />

        <div>
          Pedido: {pedido.numeroPedido || pedido.id || "-"}
          <br />
          Data: {new Date().toLocaleString()}
        </div>

        <div className="linha" />

        <div className="centro">
          <strong>ITENS</strong>
        </div>

        {pedido.itens?.map((i, idx) => {
          const descricao =
            i.produto?.title || i.descricao || "Produto";
          const qtd = i.quantidade || 1;
          const unit = Number(i.valorUnitario || i.valor || 0);
          const subtotal = qtd * unit;

          return (
            <div key={idx}>
              <div>
                {qtd}x {descricao}
              </div>
              <div className="item">
                <span>Unit:</span>
                <span>R$ {unit.toFixed(2)}</span>
              </div>
              <div className="item">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="linha" />
            </div>
          );
        })}

        <div className="item">
          <strong>TOTAL:</strong>
          <strong>R$ {total.toFixed(2)}</strong>
        </div>

        <div className="linha" />

        <div>
          Tributos aprox:
          <br />
          Fed: R$ {impostoFederal.toFixed(2)}
          <br />
          Est: R$ {impostoEstadual.toFixed(2)}
        </div>

        <div className="linha" />

        <div>Forma: {forma}</div>

        {pedido.pixCodigo && (
          <>
            <div className="linha" />
            <div className="centro">
              <strong>PAGAMENTO PIX</strong>
            </div>
            {pedido.pixQrCodeBase64 && (
              <div className="centro">
                <img
                  src={pedido.pixQrCodeBase64}
                  alt="QR Code"
                  style={{ width: "150px" }}
                />
              </div>
            )}
            <div style={{ wordBreak: "break-all" }}>
              {pedido.pixCodigo}
            </div>
          </>
        )}

        <div className="linha" />
        <div className="centro">{empresa.mensagemCupom}</div>

        <div className="centro">
          Documento sem valor fiscal
          <br />
          Ambiente de testes
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button onClick={imprimirApenasCupom}>
          Imprimir Cupom
        </button>

        <button
          onClick={finalizar}
          style={{ marginLeft: 10 }}
        >
          Finalizar Venda
        </button>
      </div>
    </div>
  );
}