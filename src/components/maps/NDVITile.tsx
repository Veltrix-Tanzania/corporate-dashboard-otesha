import { Satellite } from "lucide-react";

export function NDVITile({
  seed = 3,
  ndvi = 0.55,
  height = 300,
  label = "Satellite NDVI",
  radius = 14,
  mini = false,
  variantKey,
}: {
  seed?: number;
  ndvi?: number;
  height?: number;
  label?: string;
  radius?: number;
  mini?: boolean;
  variantKey?: string;
}) {
  const fid = `ndvi-${seed}-${variantKey ?? "default"}`;
  const lush = Math.min(1, Math.max(0, ndvi));
  const freq = 0.014 + lush * 0.006;
  const roadOffset = 70 + seed * 6;

  const gradient = `radial-gradient(120% 120% at ${28 + lush * 8}% ${18 + seed}%, oklch(${0.42 + lush * 0.18} ${0.1 + lush * 0.04} 145), oklch(${0.36 + lush * 0.14} 0.10 150) 55%, oklch(${0.82 - lush * 0.28} 0.15 100) 100%)`;

  const sparse = 1 - lush;

  return (
    <div
      key={variantKey}
      className="relative overflow-hidden bg-[#1d3a2a] transition-opacity duration-300"
      style={{ height, borderRadius: radius }}
    >
      <div className="absolute inset-0 transition-all duration-500" style={{ background: gradient }} />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 block"
      >
        <defs>
          <filter id={fid} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${freq} ${freq + 0.004}`}
              numOctaves="4"
              seed={seed}
              stitchTiles="stitch"
              result="n"
            />
            <feColorMatrix in="n" type="saturate" values={String(0.8 + lush * 0.4)} result="g" />
            <feComponentTransfer in="g" result="c">
              <feFuncR
                type="table"
                tableValues={`0.06 ${0.1 + lush * 0.05} ${0.28 + lush * 0.12} ${0.55 + lush * 0.1} 0.86 0.97`}
              />
              <feFuncG
                type="table"
                tableValues={`0.18 ${0.32 + lush * 0.1} ${0.5 + lush * 0.12} ${0.68 + lush * 0.08} 0.84 0.93`}
              />
              <feFuncB
                type="table"
                tableValues={`0.10 0.12 0.13 0.16 ${(0.18 + sparse * 0.08).toFixed(2)} 0.34`}
              />
              <feFuncA type="table" tableValues="1 1" />
            </feComponentTransfer>
          </filter>
          <filter id={fid + "p"}>
            <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" seed={seed + 4} result="p" />
            <feColorMatrix
              in="p"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"
            />
          </filter>
        </defs>
        <rect width="600" height="300" filter={`url(#${fid})`} />
        <g stroke="#cfe0d3" strokeOpacity={0.25 + lush * 0.15} strokeWidth="1.4" fill="none">
          <path d={`M0 ${roadOffset} Q 160 ${40 + seed} 300 110 T 600 90`} />
          <path d="M120 0 Q 180 140 140 300" />
          <path d="M0 220 Q 220 200 380 250 T 600 220" />
        </g>
        <rect width="600" height="300" filter={`url(#${fid}p)`} opacity={0.6 + lush * 0.4} />
      </svg>
      {!mini && (
        <div className="absolute right-3.5 top-3.5 flex flex-col gap-1 rounded-[10px] bg-[rgba(18,38,28,.82)] p-2 text-[11px] text-[#cfe3d4]">
          <div className="mb-0.5 font-bold text-[#eaf3ec]">NDVI · {ndvi.toFixed(2)}</div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.42_0.10_150)]" />
            Dense canopy
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.62_0.12_135)]" />
            Regrowth
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.86_0.15_100)]" />
            Sparse / bare
          </div>
        </div>
      )}
      {label && (
        <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full bg-[rgba(18,38,28,.82)] px-3 py-1.5 text-xs font-semibold text-[#dcebdf] backdrop-blur-sm">
          <Satellite size={13} strokeWidth={2} />
          {label}
        </div>
      )}
    </div>
  );
}
