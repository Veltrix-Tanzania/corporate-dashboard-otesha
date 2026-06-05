"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Check } from "lucide-react";
import { IMPACT_PERIODS, DEFAULT_IMPACT_RANGE } from "@/lib/constants";
import type { ImpactDateRange, ImpactPeriod } from "@/lib/types";
import { Button } from "./Button";

export function ImpactDateFilter({
  value,
  onChange,
}: {
  value: ImpactDateRange;
  onChange: (range: ImpactDateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const setPeriod = (period: ImpactPeriod) => {
    const next = { ...value, period };
    if (period === "custom" && !next.customStart) {
      next.customStart = DEFAULT_IMPACT_RANGE.customStart;
      next.customEnd = DEFAULT_IMPACT_RANGE.customEnd;
    }
    onChange(next);
    if (period !== "custom") setOpen(false);
  };

  const label =
    value.period === "custom" && value.customStart && value.customEnd
      ? `${new Date(value.customStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(value.customEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : IMPACT_PERIODS.find((p) => p.key === value.period)?.label ?? "Month";

  return (
    <div ref={ref} className="relative">
      <div className="inline-flex items-center gap-2">
        <div className="inline-flex rounded-full border border-line bg-tile p-1">
          {IMPACT_PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                value.period === p.key
                  ? "bg-ink text-[#eaf3ec] shadow-[0_2px_8px_-2px_rgba(20,50,40,.4)]"
                  : "text-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {value.period === "custom" && (
          <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
            <Calendar size={15} strokeWidth={1.9} />
            {label}
          </Button>
        )}
      </div>

      {open && value.period === "custom" && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-[280px] rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-4 shadow-[var(--shadow-lg)]">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.09em] text-muted">
            Custom date range
          </p>
          <div className="grid gap-3">
            <label className="grid gap-1.5 text-[12.5px] font-semibold text-ink-2">
              Start
              <input
                type="date"
                value={draft.customStart ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, customStart: e.target.value }))}
                className="rounded-[var(--r-sm)] border border-line bg-card px-3 py-2 text-[13px] font-medium text-ink"
              />
            </label>
            <label className="grid gap-1.5 text-[12.5px] font-semibold text-ink-2">
              End
              <input
                type="date"
                value={draft.customEnd ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, customEnd: e.target.value }))}
                className="rounded-[var(--r-sm)] border border-line bg-card px-3 py-2 text-[13px] font-medium text-ink"
              />
            </label>
          </div>
          <button
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-[#eaf3ec]"
          >
            <Check size={14} strokeWidth={2.4} />
            Apply range
          </button>
        </div>
      )}
    </div>
  );
}
