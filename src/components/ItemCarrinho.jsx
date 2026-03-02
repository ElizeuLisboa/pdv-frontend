import React from "react";
import { toast } from "react-toastify";

export default function ItemCarrinho({ item, alterarQtd, removerItem }) {
  return (
    <tr>
      <td>{item.title}</td>

      <td className="text-center">
        <button onClick={() => alterarQtd(item.id, -1)}>-</button>

        <span
          className={
            item.estoque <= 0
              ? "text-red-600 font-bold"
              : item.estoque <= item.quantidade
                ? "text-yellow-600 font-semibold"
                : ""
          }
        >
          {item.quantidade}
        </span>
        <button
          onClick={() => {
            if (item.quantidade < item.estoque) {
              alterarQtd(item.id, 1);
            } else {
              toast.warning("Estoque insuficiente!");
            }
          }}
        >
          +
        </button>

        {/* <button onClick={() => alterarQtd(item.id, 1)}>+</button> */}
      </td>

      <td className="text-right">
        R$ {(item.price * item.quantidade).toFixed(2)}
      </td>

      <td className="text-center">
        <button
          onClick={() => {
            if (window.confirm("Remover item?")) {
              removerItem(item.id);
            }
          }}
          className="text-red-500 hover:text-red-700"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}

