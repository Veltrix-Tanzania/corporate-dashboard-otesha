import { TrendingDown, TrendingUp } from "lucide-react";
import { MiniSpark } from "@/components/charts/MiniSpark";

type DeltaDir = "up" | "down" | "flat";

type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number }>;

export function KPI({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  delta,
  deltaDir = "up",
  spark,
  sparkColor,
}: {
  icon: IconComponent;
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  delta?: string;
  deltaDir?: DeltaDir;
  spark?: number[];
  sparkColor?: string;
}) {
  const deltaStyles: Record<DeltaDir, string> = {
    up: "bg-ok-bg text-ok-ink",
    down: "bg-[#f3ddd6] text-[#8a3320]",
    flat: "bg-tile text-muted",
  };

  return (
    <div className="fade-in relative flex flex-col gap-1 overflow-hidden rounded-[var(--r-lg)] border border-[rgba(20,50,40,.07)] bg-card p-5 shadow-[var(--shadow)]">
      {/* Subtle top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[oklch(0.55_0.13_150)]/40 to-transparent" />

      <div className="mb-2 flex items-center gap-3">
        <div className="grid h-9 w-9 flex-none place-items-center rounded-sm bg-linear-to-br from-[#e8f3e9] to-[#d8ead9] text-green-deep shadow-[inset_0_1px_1px_rgba(255,255,255,.9),0_1px_3px_rgba(20,50,40,.1)]">
          <Icon size={18} strokeWidth={1.9} />
        </div>
        <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">{label}</div>
        {spark && (
          <div className="ml-auto">
            <MiniSpark series={spark} color={sparkColor} />
          </div>
        )}
      </div>

      <div className="font-serif text-[29px] font-semibold leading-none tracking-[-0.015em] text-ink">
        {value}
        {unit && <small className="ml-0.5 font-sans text-sm font-semibold text-muted">{unit}</small>}
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted">
        {delta != null && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-xs font-bold ${deltaStyles[deltaDir]}`}>
            {deltaDir === "down" ? (
              <TrendingDown size={11} strokeWidth={2.4} />
            ) : (
              <TrendingUp size={11} strokeWidth={2.4} />
            )}
            {delta}
          </span>
        )}
        <span>{sub}</span>
      </div>
    </div>
  );
}
