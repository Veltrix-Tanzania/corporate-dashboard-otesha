/* ============================================================
   Charts — hand-built SVG, no dependencies
   Exposed on window: BarCompareChart, TreesSurvivalChart,
   AreaTrend, MiniSpark, DonutStat
   ============================================================ */

const chartFmtK = (n) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + "M"
  : n >= 1000 ? (n / 1000).toFixed(n % 1000 ? 1 : 0) + "k"
  : "" + n;

/* ---- Grouped bars: Investment vs Verified impact (per project) ---- */
function BarCompareChart({ data }) {
  // data: [{label, a, b}]  a = invested, b = verified
  const W = 720, H = 280, padL = 54, padR = 16, padT = 18, padB = 46;
  const iw = W - padL - padR, ih = H - padT - padB;
  const max = Math.max(...data.flatMap((d) => [d.a, d.b])) * 1.12;
  const groupW = iw / data.length;
  const barW = Math.min(34, groupW / 3.4);
  const y = (v) => padT + ih - (v / max) * ih;
  const ticks = 4;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const v = (max / ticks) * i;
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#e6efe7" />
            <text x={padL - 10} y={y(v) + 4} textAnchor="end" fontSize="10.5" fill="#88998f" fontFamily="var(--mono)">
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
            <rect x={cx - barW - gap / 2} y={y(d.a)} width={barW} height={padT + ih - y(d.a)} rx="4" fill="oklch(0.62 0.07 152)" />
            <rect x={cx + gap / 2} y={y(d.b)} width={barW} height={padT + ih - y(d.b)} rx="4" fill="oklch(0.5 0.12 150)" />
            <text x={cx} y={H - padB + 18} textAnchor="middle" fontSize="11" fill="#5f7468" fontWeight="600">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---- Combo: trees planted (bars) + survival rate (line) ---- */
function TreesSurvivalChart({ data }) {
  // data: [{label, trees, surv (0-1)}]
  const W = 720, H = 280, padL = 50, padR = 50, padT = 18, padB = 46;
  const iw = W - padL - padR, ih = H - padT - padB;
  const maxT = Math.max(...data.map((d) => d.trees)) * 1.15;
  const groupW = iw / data.length;
  const barW = Math.min(46, groupW * 0.5);
  const yT = (v) => padT + ih - (v / maxT) * ih;
  // survival axis 0.6..1.0
  const sMin = 0.6, sMax = 1.0;
  const yS = (v) => padT + ih - ((v - sMin) / (sMax - sMin)) * ih;
  const pts = data.map((d, i) => [padL + groupW * i + groupW / 2, yS(d.surv)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const v = maxT * t;
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yT(v)} y2={yT(v)} stroke="#e6efe7" />
            <text x={padL - 8} y={yT(v) + 4} textAnchor="end" fontSize="10.5" fill="#88998f" fontFamily="var(--mono)">{chartFmtK(v)}</text>
          </g>
        );
      })}
      {[0.6, 0.7, 0.8, 0.9, 1.0].map((s, i) => (
        <text key={i} x={W - padR + 8} y={yS(s) + 4} textAnchor="start" fontSize="10.5" fill="oklch(0.6 0.1 82)" fontFamily="var(--mono)">{Math.round(s * 100)}%</text>
      ))}
      {data.map((d, i) => {
        const cx = padL + groupW * i + groupW / 2;
        return (
          <g key={i}>
            <rect x={cx - barW / 2} y={yT(d.trees)} width={barW} height={padT + ih - yT(d.trees)} rx="4" fill="oklch(0.74 0.05 152)" />
            <text x={cx} y={H - padB + 18} textAnchor="middle" fontSize="11" fill="#5f7468" fontWeight="600">{d.label}</text>
          </g>
        );
      })}
      <path d={line} fill="none" stroke="oklch(0.66 0.12 78)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="4.5" fill="#fff" stroke="oklch(0.66 0.12 78)" strokeWidth="2.5" />
        </g>
      ))}
    </svg>
  );
}

/* ---- Area trend (NDVI / CO2 / canopy over time) ---- */
function AreaTrend({ series, labels, color = "oklch(0.5 0.12 150)", fill = "oklch(0.5 0.12 150)", suffix = "", height = 230 }) {
  const W = 720, H = height, padL = 46, padR = 16, padT = 16, padB = 36;
  const iw = W - padL - padR, ih = H - padT - padB;
  const max = Math.max(...series) * 1.15 || 1;
  const x = (i) => padL + (iw / (series.length - 1)) * i;
  const y = (v) => padT + ih - (v / max) * ih;
  const lp = series.map((v, i) => (i ? "L" : "M") + x(i) + " " + y(v)).join(" ");
  const ap = lp + ` L ${x(series.length - 1)} ${padT + ih} L ${x(0)} ${padT + ih} Z`;
  const gid = "ag" + Math.round(Math.random() * 1e6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.22" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={padL} x2={W - padR} y1={padT + ih * t} y2={padT + ih * t} stroke="#e6efe7" />
      ))}
      <path d={ap} fill={`url(#${gid})`} />
      <path d={lp} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {series.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={H - 12} textAnchor="middle" fontSize="10.5" fill="#88998f" fontWeight="600">{l}</text>
      ))}
    </svg>
  );
}

/* ---- Mini sparkline (KPI) ---- */
function MiniSpark({ series, color = "oklch(0.5 0.12 150)", w = 90, h = 30 }) {
  const max = Math.max(...series), min = Math.min(...series);
  const x = (i) => (w / (series.length - 1)) * i;
  const y = (v) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  const lp = series.map((v, i) => (i ? "L" : "M") + x(i) + " " + y(v)).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={lp} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(series.length - 1)} cy={y(series[series.length - 1])} r="2.6" fill={color} />
    </svg>
  );
}

/* ---- Donut stat (survival / confidence) ---- */
function DonutStat({ value, size = 96, stroke = 11, color = "oklch(0.5 0.12 150)", track = "#e6efe7", label, sub }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const off = c * (1 - value);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: size * 0.26, fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>
            {Math.round(value * 100)}<span style={{ fontSize: size * 0.14 }}>%</span>
          </div>
          {sub && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BarCompareChart, TreesSurvivalChart, AreaTrend, MiniSpark, DonutStat, chartFmtK });
