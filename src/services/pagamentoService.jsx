export const simularPixPago = async (txid) => {
  const simularPixPago = async (txid) => {
    await axios.post(`/pagamentos/simular/${txid}`);
  };
};
