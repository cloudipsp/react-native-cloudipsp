const CVV4_BINS = ["32", "33", "34", "37"];

export function isCvv4Length(cardNumber) {
  for (let i = CVV4_BINS.length - 1; i >= 0; --i) {
    if (cardNumber.startsWith(CVV4_BINS[i])) {
      return true;
    }
  }
  return false;
}
