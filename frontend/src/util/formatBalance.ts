export function formatBalance(balance: number) {
  const strBalance = String(balance);
  const decimalIndex = strBalance.indexOf(".");

  if (decimalIndex === -1) {
    return Number(strBalance).toLocaleString("en-US"); // No decimals, just format with commas
  }

  let truncateAt = decimalIndex + 1;
  let significantDigits = 0;

  // Find where to truncate (keeping 4 significant decimal digits)
  for (let i = decimalIndex + 1; i < strBalance.length; i++) {
    if (strBalance[i] !== "0" || significantDigits > 0) {
      significantDigits++;
      if (significantDigits === 4) {
        truncateAt = i + 1;
        break;
      }
    }
  }

  // Extract integer and decimal parts
  const [integerPart, decimalPart] = strBalance.slice(0, truncateAt).split(".");

  // Format integer part with commas
  return decimalPart
    ? `${Number(integerPart).toLocaleString("en-US")}.${decimalPart}`
    : Number(integerPart).toLocaleString("en-US");
}
