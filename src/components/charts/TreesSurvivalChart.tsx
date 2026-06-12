import { chartFmtK } from "@/lib/format";

type TreeData = { label: string; trees: number; surv: number };

export function TreesSurvivalChart({ data }: { data: TreeData[] }) {
  const W = 720;
  const H = 280;
  const padL = 50;
  const padR = 50;
  const padT = 18;
  const padB = 46;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const maxT = (Math.max(...data.map((d) => d.trees)) * 1.15) || 1;
  const groupW = iw / (data.length || 1);
  const barW = Math.min(46, groupW * 0.5);
  const yT = (v: number) => padT + ih - (v / maxT) * ih;
  const sMin = 0.6;
  const sMax = 1.0;
  const yS = (v: number) => padT + ih - ((v - sMin) / (sMax - sMin)) * ih;
  const pts = data.map((d, i) => [padL + groupW * i + groupW / 2, yS(d.surv)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const v = maxT * t;
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yT(v)} y2={yT(v)} stroke="#e6efe7" />
            <text
              x={padL - 8}
              y={yT(v) + 4}
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
      {[0.6, 0.7, 0.8, 0.9, 1.0].map((s, i) => (
        <text
          key={i}
          x={W - padR + 8}
          y={yS(s) + 4}
          textAnchor="start"
          fontSize="10.5"
          fill="oklch(0.6 0.1 82)"
          fontFamily="var(--mono)"
        >
          {Math.round(s * 100)}%
        </text>
      ))}
      {data.map((d, i) => {
        const cx = padL + groupW * i + groupW / 2;
        return (
          <g key={i}>
            <rect
              x={cx - barW / 2}
              y={yT(d.trees)}
              width={barW}
              height={Math.max(0, padT + ih - yT(d.trees))}
              rx="4"
              fill="oklch(0.74 0.05 152)"
            />
            <text x={cx} y={H - padB + 18} textAnchor="middle" fontSize="11" fill="#5f7468" fontWeight="600">
              {d.label}
            </text>
          </g>
        );
      })}
      <path
        d={line}
        fill="none"
        stroke="oklch(0.66 0.12 78)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="#fff" stroke="oklch(0.66 0.12 78)" strokeWidth="2.5" />
      ))}
    </svg>
  );
}
