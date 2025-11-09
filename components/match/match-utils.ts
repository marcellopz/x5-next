export function formatNumber(num: number | string): string {
  const numValue = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(numValue)) return "0";
  return numValue.toLocaleString("en-US");
}

export function floatToPercentageString(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

