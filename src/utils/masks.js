export function maskCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim()
    .slice(0, 19);
}

export function maskCPF(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

export function getCardBrand(cardNumber = "") {
  const number = cardNumber.replace(/\D/g, "");

  if (/^4/.test(number)) return "visa";
  // Mastercard: 51–55 ou 2221–2720
  if (
    /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/.test(
      number
    )
  ) {
    return "mastercard";
  }

  if (/^3[47]/.test(number)) return "amex";

  if (
    /^6011/.test(number) ||
    /^65/.test(number) ||
    /^64[4-9]/.test(number) ||
    /^(62212[6-9]|6221[3-9]|622[2-8]|6229[0-2][0-5])/.test(number)
  ) {
    return "discover";
  }

  return null;
}
