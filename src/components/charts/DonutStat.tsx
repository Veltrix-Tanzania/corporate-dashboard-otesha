export function DonutStat({
  value,
  size = 96,
  stroke = 11,
  color = "oklch(0.5 0.12 150)",
  track = "#e6efe7",
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-serif font-semibold leading-none text-ink" style={{ fontSize: size * 0.26 }}>
            {Math.round(value * 100)}
            <span style={{ fontSize: size * 0.14 }}>%</span>
          </div>
          {sub && <div className="mt-0.5 text-[10px] text-muted">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
