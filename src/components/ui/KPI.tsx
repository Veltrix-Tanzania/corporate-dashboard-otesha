import { TrendingUp } from "lucide-react";
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
    <div className="fade-in flex flex-col gap-1 overflow-hidden rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-5 shadow-[var(--shadow)]">
      <div className="mb-2 flex items-center gap-3">
        <div className="grid h-[38px] w-[38px] flex-none place-items-center rounded-[var(--r-sm)] bg-tile text-green-deep">
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">{label}</div>
        {spark && (
          <div className="ml-auto">
            <MiniSpark series={spark} color={sparkColor} />
          </div>
        )}
      </div>
      <div className="font-serif text-[30px] font-semibold leading-none tracking-[-0.01em] text-ink">
        {value}
        {unit && <small className="ml-0.5 font-sans text-sm font-semibold text-muted">{unit}</small>}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted">
        {delta != null && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-xs font-bold ${deltaStyles[deltaDir]}`}>
            <TrendingUp
              size={12}
              strokeWidth={2.4}
              style={{ transform: deltaDir === "down" ? "scaleY(-1)" : "none" }}
            />
            {delta}
          </span>
        )}
        <span>{sub}</span>
      </div>
    </div>
  );
}
