// src/components/MenuToggle.jsx
import React from "react";

export default function MenuToggle({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-white font-semibold hover:underline"
    >
      <span className="text-2xl">&#9776;</span> <span>Todos</span>
    </button>
  );
}
