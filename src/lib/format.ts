export const FX = 2600;

export const usd = (tzs: number) => Math.round(tzs / FX);

export const fmtTZS = (n: number) => "TZS " + n.toLocaleString("en-US");

export const fmtUSD = (n: number) => "$" + n.toLocaleString("en-US");

export const compactTZS = (n: number) =>
  n >= 1e9
    ? "TZS " + (n / 1e9).toFixed(2) + "B"
    : n >= 1e6
      ? "TZS " + (n / 1e6).toFixed(1) + "M"
      : "TZS " + Math.round(n).toLocaleString();

export const compactUSD = (n: number) =>
  n >= 1e6
    ? "$" + (n / 1e6).toFixed(2) + "M"
    : n >= 1e3
      ? "$" + Math.round(n / 1e3) + "K"
      : "$" + Math.round(n);

export const chartFmtK = (n: number) =>
  n >= 1_000_000
    ? (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + "M"
    : n >= 1000
      ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + "k"
      : "" + n;
