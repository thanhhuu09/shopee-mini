export function formatCurrency(amountInMinor: number, currency: string) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  return formatter.format(amountInMinor / 100);
}
