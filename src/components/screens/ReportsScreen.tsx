"use client";

import { useState } from "react";
import {
  Bell,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Satellite,
} from "lucide-react";
import { NDVITile } from "@/components/maps/NDVITile";
import { Badge } from "@/components/ui/Badge";
import { DateRange } from "@/components/ui/DateRange";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { usePortal } from "@/providers/PortalProvider";
import { DATE_RANGES } from "@/lib/constants";
import type { DateRangeKey, Role, Route } from "@/lib/types";

export function ReportsScreen({
  role,
  go,
}: {
  role: Role;
  go: (next: Partial<Route>) => void;
}) {
  const { reports, projects, projectById } = usePortal();
  const [status, setStatus] = useState<"all" | "new" | "reviewed">("all");
  const [proj, setProj] = useState("all");
  const [rangeKey, setRangeKey] = useState<DateRangeKey>("all");
  const months = DATE_RANGES.find((r) => r.key === rangeKey)!.months;

  const list = reports.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (proj === "all" || r.projectId === proj) &&
      (rangeKey === "all" || r.monthsBack <= months),
  );
  const newCount = reports.filter((r) => r.status === "new").length;

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-[22px] flex items-end justify-between gap-5">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.11em] text-muted">
            Satellite updates
          </div>
          <h1 className="mt-1.5 font-serif text-[30px] font-semibold leading-[1.05] tracking-[-0.01em]">
            Reports
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Every satellite image we save of your projects becomes a short update. Filter them by date
            or project.
          </p>
        </div>
        <RoleToggle role={role} setRole={(r) => go({ screen: "reports", role: r })} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-5 shadow-[var(--shadow)]">
          <div className="mb-2 flex items-center gap-3">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[var(--r-sm)] bg-tile text-green-deep">
              <FileText size={19} strokeWidth={1.8} />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Saved updates</div>
          </div>
          <div className="font-serif text-[30px] font-semibold leading-none">{reports.length}</div>
          <div className="mt-1.5 text-[12.5px] text-muted">across all projects</div>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-5 shadow-[var(--shadow)]">
          <div className="mb-2 flex items-center gap-3">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[var(--r-sm)] bg-new-bg text-new-ink">
              <Bell size={18} strokeWidth={1.8} />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Not seen yet</div>
          </div>
          <div className="font-serif text-[30px] font-semibold leading-none">{newCount}</div>
          <div className="mt-1.5 text-[12.5px] text-muted">new since you last looked</div>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-5 shadow-[var(--shadow)]">
          <div className="mb-2 flex items-center gap-3">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[var(--r-sm)] bg-tile text-green-deep">
              <Satellite size={18} strokeWidth={1.8} />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Last image saved</div>
          </div>
          <div className="font-serif text-[22px] font-semibold leading-none">Jun 3</div>
          <div className="mt-1.5 text-[12.5px] text-muted">Sentinel-2 · 4% cloud</div>
        </div>
        <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-5 shadow-[var(--shadow)]">
          <div className="mb-2 flex items-center gap-3">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[var(--r-sm)] bg-tile text-green-deep">
              <Download size={18} strokeWidth={1.8} />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-muted">Filed for ESG</div>
          </div>
          <div className="font-serif text-[30px] font-semibold leading-none">3</div>
          <div className="mt-1.5 text-[12.5px] text-muted">PDFs filed this quarter</div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-line bg-tile p-1">
          {(
            [
              ["all", "All"],
              ["new", "New"],
              ["reviewed", "Seen"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setStatus(k)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${
                status === k
                  ? "bg-ink text-[#eaf3ec] shadow-[0_2px_8px_-2px_rgba(20,50,40,.4)]"
                  : "text-muted"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <DateRange value={rangeKey} setValue={setRangeKey} />
          <div className="flex items-center gap-2">
            <Filter size={15} strokeWidth={1.9} className="text-muted" />
            <select
              value={proj}
              onChange={(e) => setProj(e.target.value)}
              className="rounded-full border border-line bg-card px-3.5 py-2 text-[13px] font-semibold text-ink-2"
            >
              <option value="all">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.short}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[12.5px] text-muted">
        {list.length} update{list.length === 1 ? "" : "s"}
        {rangeKey !== "all"
          ? " in the " + DATE_RANGES.find((r) => r.key === rangeKey)!.label.toLowerCase()
          : ""}
      </div>

      <div className="mt-3 rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card shadow-[var(--shadow)]">
        {list.map((r) => {
          const p = projectById(r.projectId)!;
          const up = r.trigger.dir === "up";
          return (
            <div
              key={r.id}
              className="flex cursor-pointer items-center gap-[18px] border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-sage-2"
              onClick={() => go({ screen: "report", id: r.id, role })}
            >
              <div className="w-24 flex-none">
                <NDVITile seed={(p.id.length % 6) + 1} height={62} radius={10} label="" mini />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-[14.5px]">{r.title}</b>
                  {r.status === "new" && <Badge kind="new">New</Badge>}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted">
                  {p.short} · {r.generated.split(" · ")[0]}
                </div>
              </div>
              <div className="flex-none text-right">
                <div
                  className={`inline-flex items-center rounded-full px-1.5 py-px text-[13.5px] font-bold ${
                    up ? "bg-ok-bg text-ok-ink" : "bg-[#f3ddd6] text-[#8a3320]"
                  }`}
                >
                  Tree cover {up ? "+" : ""}
                  {r.trigger.delta}%
                </div>
              </div>
              <ChevronRight size={18} strokeWidth={2} className="text-muted-2" />
            </div>
          );
        })}
        {!list.length && (
          <div className="p-6 text-[12.5px] text-muted">No updates match these filters.</div>
        )}
      </div>
      <div className="h-[30px]" />
    </div>
  );
}
