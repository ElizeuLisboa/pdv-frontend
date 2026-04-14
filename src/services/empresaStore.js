// let empresaSelecionada = null;

// export const setEmpresaSelecionadaGlobal = (id) => {
//   empresaSelecionada = id;
// };

// export const getEmpresaSelecionada = () => {
//   return empresaSelecionada;
// };
let empresaSelecionada = null;

export const setEmpresaSelecionadaGlobal = (id) => {
  empresaSelecionada = id;
  localStorage.setItem("empresaSelecionada", id); // 🔥 NOVO
};

export const getEmpresaSelecionada = () => {
  if (!empresaSelecionada) {
    const saved = localStorage.getItem("empresaSelecionada");
    if (saved) {
      empresaSelecionada = Number(saved);
    }
  }
  return empresaSelecionada;
};