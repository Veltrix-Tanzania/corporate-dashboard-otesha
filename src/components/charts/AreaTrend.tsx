"use client";

import { useId } from "react";

export function AreaTrend({
  series,
  labels,
  color = "oklch(0.5 0.12 150)",
  fill = "oklch(0.5 0.12 150)",
  height = 230,
}: {
  series: number[];
  labels: string[];
  color?: string;
  fill?: string;
  suffix?: string;
  height?: number;
}) {
  const W = 720;
  const H = height;
  const padL = 46;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const max = Math.max(...series) * 1.15 || 1;
  const x = (i: number) => padL + (iw / (series.length - 1)) * i;
  const y = (v: number) => padT + ih - (v / max) * ih;
  const lp = series.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const ap = `${lp} L ${x(series.length - 1)} ${padT + ih} L ${x(0)} ${padT + ih} Z`;
  const gid = useId().replace(/:/g, "");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
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
        <text key={i} x={x(i)} y={H - 12} textAnchor="middle" fontSize="10.5" fill="#88998f" fontWeight="600">
          {l}
        </text>
      ))}
    </svg>
  );
}
