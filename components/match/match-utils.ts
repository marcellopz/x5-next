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

export function convertScoreToGrade(score: number): string {
  if (score >= 10) return "S+";
  if (score >= 9.375) return "S";
  if (score >= 8.75) return "S-";
  if (score >= 8.125) return "A+";
  if (score >= 7.5) return "A";
  if (score >= 6.875) return "A-";
  if (score >= 6.25) return "B+";
  if (score >= 5.625) return "B";
  if (score >= 5) return "B-";
  if (score >= 4.375) return "C+";
  if (score >= 3.75) return "C";
  if (score >= 3.125) return "C-";
  if (score >= 2.5) return "D+";
  if (score >= 1.875) return "D";
  if (score >= 1.25) return "D-";
  if (score >= 0.625) return "F";
  return "F-";
}
