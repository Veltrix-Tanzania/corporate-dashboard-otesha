export function MiniSpark({
  series,
  color = "oklch(0.5 0.12 150)",
  w = 90,
  h = 30,
}: {
  series: number[];
  color?: string;
  w?: number;
  h?: number;
}) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const steps = Math.max(series.length - 1, 1);
  const x = (i: number) => (w / steps) * i;
  const y = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  const lp = series.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <path d={lp} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(series.length - 1)} cy={y(series[series.length - 1])} r="2.6" fill={color} />
    </svg>
  );
}
