import { chartFmtK } from "@/lib/format";

type BarData = { label: string; a: number; b: number };

export function BarCompareChart({ data }: { data: BarData[] }) {
  const W = 720;
  const H = 280;
  const padL = 54;
  const padR = 16;
  const padT = 18;
  const padB = 46;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const max = (Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.12) || 1;
  const groupW = iw / (data.length || 1);
  const barW = Math.min(34, groupW / 3.4);
  const y = (v: number) => padT + ih - (v / max) * ih;
  const ticks = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const v = (max / ticks) * i;
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#e6efe7" />
            <text
              x={padL - 10}
              y={y(v) + 4}
              textAnchor="end"
              fontSize="10.5"
              fill="#88998f"
              fontFamily="var(--mono)"
            >
              {chartFmtK(v)}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const cx = padL + groupW * i + groupW / 2;
        const gap = 5;
        return (
          <g key={i}>
            <rect
              x={cx - barW - gap / 2}
              y={y(d.a)}
              width={barW}
              height={Math.max(0, padT + ih - y(d.a))}
              rx="4"
              fill="oklch(0.62 0.07 152)"
            />
            <rect
              x={cx + gap / 2}
              y={y(d.b)}
              width={barW}
              height={Math.max(0, padT + ih - y(d.b))}
              rx="4"
              fill="oklch(0.5 0.12 150)"
            />
            <text x={cx} y={H - padB + 18} textAnchor="middle" fontSize="11" fill="#5f7468" fontWeight="600">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
