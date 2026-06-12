"use client";

import {
  AlertTriangle,
  Car,
  ChevronLeft,
  CircleDollarSign,
  Download,
  Eye,
  Flame,
  Home,
  Mail,
  TreePine,
  TrendingUp,
} from "lucide-react";
import { Co2Icon } from "@/components/ui/Co2Icon";
import { printReportPDF } from "@/lib/reportPdf";
import { VegetationMap } from "@/components/maps/VegetationMap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { usePortal } from "@/providers/PortalProvider";
import { compactTZS } from "@/lib/format";
import type { Role, Route } from "@/lib/types";

export function ReportDetailScreen({
  role,
  id,
  go,
}: {
  role: Role;
  id?: string;
  go: (next: Partial<Route>) => void;
}) {
  const { reports, reportById, projectById } = usePortal();
  const r = reportById(id ?? "") ?? reports[0];
  const p = projectById(r.projectId)!;
  const exec = role === "exec";
  const up = r.trigger.dir === "up";
  const tg = r.trigger;
  const co2Add = Math.round(p.co2 * (tg.delta / 100) * 4) || 18;

  return (
    <div className="mx-auto max-w-[1180px]">
      <button
        className="mb-3.5 flex items-center gap-1.5 text-[13.5px] font-medium text-muted hover:text-ink"
        onClick={() => go({ screen: "reports", role })}
      >
        <ChevronLeft size={15} strokeWidth={2.2} /> Reports
      </button>

      <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-[25px] font-semibold">{r.title}</h1>
              {r.status === "new" ? (
                <Badge kind="new">New</Badge>
              ) : (
                <Badge kind="active">{p.status}</Badge>
              )}
            </div>
            <p className="mt-1.5 text-sm text-muted">
              {p.name} · saved {r.generated.split(" · ")[0]}
            </p>
          </div>
          <div className="flex-none text-right">
            <RoleToggle role={role} setRole={(rr) => go({ screen: "report", id: r.id, role: rr })} />
            <div className="mt-3 flex justify-end gap-2.5">
              {r.formats.includes("pdf") && (
                <Button variant="primary" size="sm" onClick={() => printReportPDF(r, p)}>
                  <Download size={15} strokeWidth={1.9} /> Download PDF
                </Button>
              )}
              {r.formats.includes("email") && (
                <Button variant="ghost" size="sm">
                  <Mail size={15} strokeWidth={1.9} /> Email me this
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div
            className={`flex items-center gap-3.5 rounded-(--r-md) px-5 py-4 ${
              up ? "bg-ok-bg text-ok-ink" : "bg-[#f3ddd6] text-[#8a3320]"
            }`}
          >
            {up ? (
              <TrendingUp size={22} strokeWidth={2} />
            ) : (
              <AlertTriangle size={22} strokeWidth={2} />
            )}
            <p className="font-serif text-[16.5px] font-medium leading-snug [text-wrap:pretty]">
              {r.headline}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {[
          {
            icon: TrendingUp,
            label: "Tree cover",
            value: `${up ? "+" : ""}${tg.delta}%`,
            note: "since the last image",
            color: up ? "text-ok-ink" : "text-[#8a3320]",
          },
          {
            icon: TreePine,
            label: "Trees",
            value: p.trees.toLocaleString(),
            note: `${Math.round(p.survival * 100)}% still alive`,
          },
          {
            icon: Co2Icon,
            label: "CO₂ stored",
            value: `${p.co2.toLocaleString()} t`,
            note: `${up ? "+" : ""}${co2Add} t this update`,
          },
          {
            icon: CircleDollarSign,
            label: "Verified value",
            value: compactTZS(p.verifiedTZS),
            note: "",
          },
        ].map((tile) => (
          <div key={tile.label} className="rounded-(--r-md) bg-tile p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted">
              <tile.icon size={14} strokeWidth={1.8} />
              {tile.label}
            </div>
            <div className={`mt-2 font-serif text-[22px] font-semibold ${tile.color ?? "text-ink"}`}>
              {tile.value}
            </div>
            <div className="mt-0.5 text-[11.5px] text-muted-2">{tile.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
        <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">Satellite imagery · NDVI</h3>
          <span className="text-[12.5px] text-muted">
            Sentinel-2 · live mosaic composite
          </span>
        </div>
        <div className="p-6">
          <VegetationMap
            lat={p.sites[0]?.lat ?? -6.37}
            lng={p.sites[0]?.lng ?? 34.89}
            height={340}
            label={`${p.short} · NDVI`}
            zoom={13}
            radius={800}
          />
        </div>
      </div>

      <div className="mt-5 rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card p-6 shadow-[var(--shadow)]">
        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.11em] text-muted">
          {exec ? "In short" : "What this update covers"}
        </div>
        <p className="font-serif text-lg leading-[1.55] text-ink [text-wrap:pretty]">
          {exec ? (
            <>
              The newest satellite image shows {p.short} is {up ? "doing well" : "being looked after"}.
              Tree cover is {up ? " up" : " down"} <b>{up ? "+" : ""}{tg.delta}%</b> since the last one,
              which is about <b>{up ? "+" : ""}{co2Add} tonnes</b> of CO₂. Nothing needs your attention —
              we&apos;ve filed it to your ESG register.
            </>
          ) : (
            <>
              We saved this image on <b>{tg.pass}</b> from {tg.sensor}. Compared with the last one, tree
              cover across {p.short}&apos;s {p.sites.length} site{p.sites.length === 1 ? "" : "s"} is{" "}
              {up ? "up" : "down"} <b>{up ? "+" : ""}{tg.delta}%</b>. The numbers above are rolled up from
              all of those sites.
            </>
          )}
        </p>

        {!exec && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {p.sites.slice(0, 6).map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between rounded-[var(--r-sm)] bg-tile px-3.5 py-2.5"
              >
                <span className="text-[12.5px] font-bold text-ink-2">{s.name}</span>
                <span className="text-[12.5px] text-muted">
                  {s.trees.toLocaleString()} trees · {Math.round(s.surv * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => go({ screen: "project", id: p.id, role })}>
            <Eye size={16} strokeWidth={1.9} /> Open the project
          </Button>
          {r.formats.includes("pdf") && (
            <Button variant="ghost" onClick={() => printReportPDF(r, p)}>
              <Download size={16} strokeWidth={1.9} /> Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* ── Emissions / Carbon offset section ────────────────────────────── */}
      <div className="mt-5 rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
        <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
            Emissions offset · Carbon impact
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(20,50,40,.08)] bg-[#eaf4ec] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-widest text-ok-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-ok-ink" />
            DEFRA verified
          </span>
        </div>

        <div className="p-6">
          {/* Primary stat row */}
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "CO₂ sequestered",
                value: `${p.co2.toLocaleString()} t`,
                sub: "tCO₂e lifetime",
                icon: Flame,
                accent: "text-[#c2520a]",
                bg: "bg-[#fef0e6]",
              },
              {
                label: "This update",
                value: `${up ? "+" : ""}${co2Add} t`,
                sub: "tCO₂e since last image",
                icon: TrendingUp,
                accent: up ? "text-ok-ink" : "text-[#8a3320]",
                bg: up ? "bg-ok-bg" : "bg-[#f3ddd6]",
              },
              {
                label: "Trees absorbing",
                value: p.trees.toLocaleString(),
                sub: `~${(p.trees * 18 / 1000).toFixed(1)} tCO₂e / yr`,
                icon: TreePine,
                accent: "text-green-deep",
                bg: "bg-[#e8f3e9]",
              },
              {
                label: "Survival rate",
                value: `${Math.round(p.survival * 100)}%`,
                sub: "active absorbers",
                icon: CircleDollarSign,
                accent: "text-[#2c4d75]",
                bg: "bg-[#e8f0fc]",
              },
            ].map((tile) => (
              <div key={tile.label} className="rounded-(--r-md) border border-line bg-tile p-4">
                <div className={`mb-2.5 grid h-8 w-8 place-items-center rounded-sm ${tile.bg} ${tile.accent}`}>
                  <tile.icon size={15} strokeWidth={1.9} />
                </div>
                <div className={`font-serif text-[21px] font-semibold leading-none ${tile.accent}`}>{tile.value}</div>
                <div className="mt-1 text-[11px] font-semibold text-muted">{tile.label}</div>
                <div className="text-[11px] text-muted-2">{tile.sub}</div>
              </div>
            ))}
          </div>

          {/* Equivalence row — makes the number relatable */}
          <div className="mb-5 rounded-(--r-md) bg-[#f4f8f5] p-5">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted">
              What {p.co2.toLocaleString()} tCO₂e is equivalent to
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Car,
                  label: "Car journeys avoided",
                  value: `${Math.round((p.co2 * 1000) / 0.17 / 100).toLocaleString()} km`,
                  note: "petrol car at 0.17 kg CO₂e / km",
                },
                {
                  icon: Home,
                  label: "Homes powered for a year",
                  value: `~${Math.round(p.co2 / 2.7).toLocaleString()}`,
                  note: "avg UK household ≈ 2.7 tCO₂e / yr",
                },
                {
                  icon: Flame,
                  label: "Litres of diesel offset",
                  value: `${Math.round((p.co2 * 1000) / 2.68).toLocaleString()} L`,
                  note: "diesel at 2.68 kg CO₂e / litre",
                },
              ].map((eq) => (
                <div key={eq.label} className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-sm bg-[#dff0e4] text-green-deep">
                    <eq.icon size={15} strokeWidth={1.9} />
                  </div>
                  <div>
                    <div className="font-serif text-[18px] font-semibold text-ink">{eq.value}</div>
                    <div className="text-[12px] font-semibold text-ink-2">{eq.label}</div>
                    <div className="text-[11px] text-muted">{eq.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology footnote */}
          <p className="text-[11.5px] leading-relaxed text-muted">
            Carbon sequestration estimated at <b>18 kg CO₂ per tree per year</b> (human-planted average, NCAIC methodology).
            Conversion equivalences use <b>DEFRA 2024</b> greenhouse gas factors.
            Lifetime figure accumulates from planting date to this report.
            {exec && " This data is filed to your ESG register automatically."}
          </p>
        </div>
      </div>

      <div className="h-[30px]" />
    </div>
  );
}
