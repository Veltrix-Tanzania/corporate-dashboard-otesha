"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  Leaf,
  MapPin,
  Satellite,
  TrendingUp,
  TreePine,
} from "lucide-react";
import { Co2Icon } from "@/components/ui/Co2Icon";
import { NDVITile } from "@/components/maps/NDVITile";
import { VegetationMap } from "@/components/maps/VegetationMap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ImpactDateFilter } from "@/components/ui/ImpactDateFilter";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePortal } from "@/providers/PortalProvider";
import { DEFAULT_IMPACT_RANGE } from "@/lib/constants";
import { compactTZS } from "@/lib/format";
import { filterReportsByRange, getImpactPeriodPhrase } from "@/lib/metrics";
import { formatCoords, siteCenter } from "@/lib/geo";
import type { ImpactDateRange, Role, Route } from "@/lib/types";

export function ProjectsScreen({
  role,
  go,
}: {
  role: Role;
  go: (next: Partial<Route>) => void;
}) {
  const { projects, company } = usePortal();

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(20,50,40,.08)] bg-card px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-deep" />
            Portfolio
          </div>
          <h1 className="mt-2 font-serif text-[26px] font-semibold leading-[1.05] tracking-[-0.015em] text-ink md:text-[30px]">
            Projects
          </h1>
          <p className="mt-1.5 text-[13.5px] text-muted">Every tree-planting project {company.name} has on the go.</p>
        </div>
        <RoleToggle role={role} setRole={(r) => go({ screen: "projects", role: r })} />
      </div>

      <div className="grid gap-4">
        {projects.map((p) => {
          const up = p.canopyDelta >= 0;
          return (
            <div
              key={p.id}
              className="cursor-pointer rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)] transition-colors hover:bg-sage-2"
              onClick={() => go({ screen: "project", id: p.id, role })}
            >
              <div className="flex items-center justify-between gap-4 p-4 sm:p-6">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-[17px] font-semibold sm:text-[19px]">{p.name}</h3>
                    <Badge kind="active">{p.status}</Badge>
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted">{p.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-3 sm:gap-5">
                    <span className="flex items-center gap-2 text-[12.5px]">
                      <CircleDollarSign size={15} strokeWidth={1.8} className="text-muted" />
                      <b>{compactTZS(p.budgetTZS)}</b>
                    </span>
                    <span className="flex items-center gap-2 text-[12.5px]">
                      <TreePine size={15} strokeWidth={1.8} className="text-muted" />
                      <b>{p.trees.toLocaleString()}</b>
                      <span className="text-muted">trees</span>
                    </span>
                    <span className="flex items-center gap-2 text-[12.5px]">
                      <MapPin size={15} strokeWidth={1.8} className="text-muted" />
                      <b>{p.locations}</b>
                      <span className="text-muted">locations</span>
                    </span>
                    {p.canopyDelta !== 0 && (
                      <span className="flex items-center gap-2 text-[12.5px]">
                        <TrendingUp size={15} strokeWidth={1.8} className="text-muted" />
                        <span className={`font-bold ${up ? "text-ok-ink" : "text-[#8a3320]"}`}>
                          {up ? "+" : ""}
                          {p.canopyDelta}% canopy
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden w-[160px] flex-none sm:block md:w-[200px]">
                  <NDVITile seed={(p.id.length % 6) + 1} height={108} radius={12} label={p.short} mini />
                </div>
                <ChevronRight size={20} strokeWidth={2} className="text-muted-2" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-[30px]" />
    </div>
  );
}

export function ProjectDetailScreen({
  role,
  id,
  go,
}: {
  role: Role;
  id?: string;
  go: (next: Partial<Route>) => void;
}) {
  const { projects, projectById, reports } = usePortal();
  const p = projectById(id ?? "") ?? projects[0];
  const [impactRange, setImpactRange] = useState<ImpactDateRange>(DEFAULT_IMPACT_RANGE);
  const exec = role === "exec";
  const rel = filterReportsByRange(
    reports.filter((r) => r.projectId === p.id),
    impactRange,
  );
  return (
    <div className="mx-auto max-w-[1180px]">
      <button
        className="mb-3.5 flex items-center gap-1.5 text-[13.5px] font-medium text-muted hover:text-ink"
        onClick={() => go({ screen: "projects", role })}
      >
        <ChevronLeft size={15} strokeWidth={2.2} /> All Projects
      </button>

      <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-[26px] font-semibold">{p.name}</h1>
              <Badge kind="active">{p.status}</Badge>
            </div>
            <p className="mt-1.5 text-sm text-muted">{p.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-[12.5px] text-muted">
              <span className="flex items-center gap-2">
                <MapPin size={14} strokeWidth={1.8} />
                {p.region}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={14} strokeWidth={1.8} />
                Started {p.started}
              </span>
              {p.species > 0 && (
                <span className="flex items-center gap-2">
                  <Leaf size={14} strokeWidth={1.8} />
                  {p.species} native species
                </span>
              )}
            </div>
          </div>
          <RoleToggle role={role} setRole={(r) => go({ screen: "project", id: p.id, role: r })} />
        </div>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {[
              {
                icon: CircleDollarSign,
                label: "Budget",
                value: compactTZS(p.budgetTZS),
                sub: "",
                note: "committed capital",
              },
              {
                icon: TreePine,
                label: "Trees planted",
                value: p.trees.toLocaleString(),
                sub: "",
                note: `across ${p.locations} location${p.locations !== 1 ? "s" : ""}`,
              },
              {
                icon: TrendingUp,
                label: "Verified value",
                value: compactTZS(p.verifiedTZS),
                sub: "",
                note: "total investment",
              },
              {
                icon: Co2Icon,
                label: "CO₂ stored (est.)",
                value: `${p.co2.toLocaleString()} t`,
                sub: "",
                note: "estimated from trees planted",
              },
            ].map((tile, i) => (
              <div key={i} className="rounded-[var(--r-md)] bg-tile p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <tile.icon size={14} strokeWidth={1.8} />
                  {tile.label}
                </div>
                <div className="mt-2 font-serif text-[22px] font-semibold tracking-[-0.01em] text-ink">
                  {tile.value}
                  {tile.sub && <small className="font-sans text-[12.5px] font-semibold text-muted">{tile.sub}</small>}
                </div>
                <div className="mt-0.5 text-[11.5px] text-muted-2">{tile.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
              Satellite imagery · NDVI
            </h3>
            <span className="mt-1 block text-[12.5px] text-muted">
              Sentinel-2 · live mosaic composite
            </span>
          </div>
          <ImpactDateFilter value={impactRange} onChange={setImpactRange} />
        </div>
        <div className="p-6">
          <VegetationMap
            lat={siteCenter(p.sites).lat}
            lng={siteCenter(p.sites).lng}
            height={320}
            label={`${p.short} · NDVI`}
            zoom={13}
            radius={800}
          />
        </div>
      </div>

      {!exec && (
        <div className="mt-5 rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
          <div className="border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">Site breakdown</h3>
          </div>
          <div className="overflow-hidden">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="border-b border-line px-4 py-2.5 text-left text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
                    Site
                  </th>
                  <th className="border-b border-line px-4 py-2.5 text-right text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
                    Trees
                  </th>
                  <th className="border-b border-line px-4 py-2.5 text-right text-[10.5px] font-bold uppercase tracking-[0.08em] text-muted">
                    Survival
                  </th>
                </tr>
              </thead>
              <tbody>
                {p.sites.map((s) => (
                  <tr key={s.name} className="transition-colors hover:bg-sage-2">
                    <td className="border-b border-line px-4 py-3 text-ink-2">
                      <b>{s.name}</b>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-2">
                        {formatCoords(s.lat, s.lng)}
                      </div>
                    </td>
                    <td className="border-b border-line px-4 py-3 text-right tabular-nums text-ink-2">
                      {s.trees.toLocaleString()}
                    </td>
                    <td className="border-b border-line px-4 py-3 text-right tabular-nums">
                      <span className="font-bold text-ok-ink">{Math.round(s.surv * 100)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SectionTitle
        action={
          <Button variant="primary" size="sm">
            <Download size={15} strokeWidth={1.9} /> Download report
          </Button>
        }
      >
        Reports for this project
      </SectionTitle>
      <p className="mb-3 text-[12.5px] text-muted">
        {rel.length} update{rel.length === 1 ? "" : "s"} {getImpactPeriodPhrase(impactRange)}
      </p>
      <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
        {rel.length ? (
          rel.map((r) => {
            const up = r.trigger.dir === "up";
            return (
              <div
                key={r.id}
                className="flex cursor-pointer items-center gap-4 border-b border-line px-6 py-4 transition-colors last:border-b-0 hover:bg-sage-2"
                onClick={() => go({ screen: "report", id: r.id, role })}
              >
                <div
                  className={`grid h-10 w-10 flex-none place-items-center rounded-[var(--r-sm)] ${
                    up ? "bg-ok-bg text-ok-ink" : "bg-[#f3ddd6] text-[#8a3320]"
                  }`}
                >
                  <Satellite size={18} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <b className="text-[13.5px]">{r.title}</b>
                    {r.status === "new" && <Badge kind="new">New</Badge>}
                  </div>
                  <div className="mt-0.5 font-mono text-[12.5px] text-muted">
                    {r.id} · {r.generated}
                  </div>
                </div>
                <span className="text-[12.5px] text-muted">
                  {up ? "+" : ""}
                  {r.trigger.delta}%
                </span>
                <ChevronRight size={16} strokeWidth={2} className="text-muted-2" />
              </div>
            );
          })
        ) : (
          <div className="p-6 text-[12.5px] text-muted">No reports generated yet for this project.</div>
        )}
      </div>
      <div className="h-[30px]" />
    </div>
  );
}
