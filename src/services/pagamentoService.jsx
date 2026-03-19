export const simularPixPago = async (txid) => {
  const simularPixPago = async (txid) => {
    await api.post(`/pagamentos/simular/${txid}`);
  };
};
