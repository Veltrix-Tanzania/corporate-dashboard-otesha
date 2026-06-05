"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Check, ChevronDown } from "lucide-react";
import { DATE_RANGES } from "@/lib/constants";
import type { DateRangeKey } from "@/lib/types";
import { Button } from "./Button";

export function DateRange({ value, setValue }: { value: DateRangeKey; setValue: (k: DateRangeKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = DATE_RANGES.find((r) => r.key === value) ?? DATE_RANGES[1];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
        <Calendar size={15} strokeWidth={1.9} />
        {cur.label}
        <ChevronDown size={14} strokeWidth={2} className="ml-0.5 text-muted" />
      </Button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[180px] rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-1.5 shadow-[var(--shadow-lg)]">
          {DATE_RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => {
                setValue(r.key);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-ink-2 ${
                r.key === value ? "bg-tile" : "bg-transparent"
              }`}
            >
              {r.key === value ? (
                <Check size={14} strokeWidth={2.4} className="text-green-deep" />
              ) : (
                <span className="w-3.5" />
              )}
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
