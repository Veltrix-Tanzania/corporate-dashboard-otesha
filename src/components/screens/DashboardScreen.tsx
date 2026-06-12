"use client";

import { useState } from "react";
import { Download, FileText, Layers, TrendingUp, TreePine } from "lucide-react";
import { Co2Icon } from "@/components/ui/Co2Icon";
import { AreaTrend } from "@/components/charts/AreaTrend";
import { BarCompareChart } from "@/components/charts/BarCompareChart";
import { DonutStat } from "@/components/charts/DonutStat";
import { TreesSurvivalChart } from "@/components/charts/TreesSurvivalChart";
import { SiteMap } from "@/components/maps/SiteMap";
import { VegetationMap } from "@/components/maps/VegetationMap";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Button } from "@/components/ui/Button";
import { ImpactDateFilter } from "@/components/ui/ImpactDateFilter";
import { KPI } from "@/components/ui/KPI";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Badge } from "@/components/ui/Badge";
import { usePortal } from "@/providers/PortalProvider";
import { compactTZS } from "@/lib/format";
import { DEFAULT_IMPACT_RANGE, METRICS } from "@/lib/constants";
import { getImpactPeriodPhrase, sliceMetricByRange } from "@/lib/metrics";
import { siteCenter } from "@/lib/geo";
import { printReportPDF } from "@/lib/reportPdf";
import type { ImpactDateRange, MetricKey, Role, Route, Site } from "@/lib/types";

function ImpactOverTime({
  impactRange,
  setImpactRange,
}: {
  impactRange: ImpactDateRange;
  setImpactRange: (range: ImpactDateRange) => void;
}) {
  const D = usePortal();
  const [metric, setMetric] = useState<MetricKey>("trees");
  const m = METRICS.find((x) => x.key === metric)!;
  const s = sliceMetricByRange(D.monthly, metric, impactRange);
  const periodPhrase = getImpactPeriodPhrase(impactRange);
  const big =
    metric === "verified"
      ? compactTZS(s.impact)
      : "+" + Math.round(s.impact).toLocaleString();

  return (
    <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((x) => (
            <button
              key={x.key}
              onClick={() => setMetric(x.key)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                metric === x.key
                  ? "bg-ink text-[#eaf3ec] shadow-sm"
                  : "border border-line bg-card text-muted hover:border-[rgba(20,50,40,.15)] hover:text-ink"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <ImpactDateFilter value={impactRange} onChange={setImpactRange} />
      </div>
      <div className="p-6">
        <div className="mb-1.5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="font-serif text-[28px] font-semibold leading-none sm:text-[34px]" style={{ color: m.color }}>
              {big}
              {m.unit}
            </div>
            <div className="mt-1 text-[12.5px] text-muted">
              {m.word} {periodPhrase}
              <span className="ml-2 inline-flex items-center rounded-full bg-ok-bg px-1.5 py-px text-xs font-bold text-ok-ink">
                +{s.pct}%
              </span>
            </div>
          </div>
          <div className="text-right text-[12.5px] text-muted">
            <div>Running total</div>
            <div className="text-[15px] font-bold text-ink">
              {metric === "verified"
                ? compactTZS(s.last)
                : Math.round(s.last).toLocaleString() + m.unit}
            </div>
          </div>
        </div>
        <AreaTrend series={s.series} labels={s.labels} color={m.color} fill={m.color} height={230} />
      </div>
    </div>
  );
}

export function DashboardScreen({
  role,
  go,
}: {
  role: Role;
  go: (next: Partial<Route>) => void;
}) {
  const D = usePortal();
  const P = D.portfolio;
  const allSites = D.projects.flatMap((p) =>
    p.sites.map((s) => ({ ...s, project: p.short })),
  );
  const [hover, setHover] = useState<Site | null>(null);
  const [impactRange, setImpactRange] = useState<ImpactDateRange>(DEFAULT_IMPACT_RANGE);
  const periodPhrase = getImpactPeriodPhrase(impactRange);

  const roi = Math.round((P.verifiedTZS / P.investedTZS - 1) * 100);

  const dTrees = sliceMetricByRange(D.monthly, "trees", impactRange).impact;
  const dCo2 = sliceMetricByRange(D.monthly, "co2", impactRange);
  const dVer = sliceMetricByRange(D.monthly, "verified", impactRange);

  const compareData = D.projects.map((p) => ({
    label: p.short.split(" ")[0],
    a: p.budgetTZS,
    b: p.verifiedTZS,
  }));
  const treesData = D.projects.map((p) => ({
    label: p.short.split(" ")[0],
    trees: p.trees,
    surv: p.survival,
  }));

  const exec = role === "exec";

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(20,50,40,.08)] bg-card px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-ok-ink" />
            Sustainability portfolio
          </div>
          <h1 className="mt-2 font-serif text-[26px] font-semibold leading-[1.05] tracking-[-0.015em] text-ink md:text-[30px]">
            {D.company.account}
          </h1>
          <p className="mt-1.5 text-[13.5px] text-muted">
            Live view of all tree-planting projects and their impact.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:text-right">
          <RoleToggle role={role} setRole={(r) => go({ screen: "dashboard", role: r })} />
          <ImpactDateFilter value={impactRange} onChange={setImpactRange} />
          <Button variant="primary" size="sm" onClick={() => go({ screen: "reports" })}>
            <Download size={15} strokeWidth={1.9} />
            {exec ? "Get the brief" : "Export data"}
          </Button>
        </div>
      </div>

      <AlertBanner
        alert={D.alerts[0]}
        onView={() => go({ screen: "report", id: D.alerts[0].reportId, role })}
      />

      <div className="mt-4 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <KPI
          icon={Layers}
          label="Active projects"
          value={P.activeProjects}
          sub={`${P.locations} planting sites`}
          delta="+1"
          deltaDir="up"
        />
        <KPI
          icon={TreePine}
          label="Trees planted"
          value={P.trees >= 1000 ? (P.trees / 1000).toFixed(1) : P.trees.toLocaleString()}
          unit={P.trees >= 1000 ? "k" : ""}
          sub={`${Math.round(P.survival * 100)}% still alive`}
          delta={dTrees >= 1000 ? "+" + (dTrees / 1000).toFixed(1) + "k" : "+" + Math.round(dTrees).toLocaleString()}
          deltaDir="up"
          spark={D.monthly.trees.slice(-6)}
          sparkColor="oklch(0.55 0.11 150)"
        />
        <KPI
          icon={Co2Icon}
          label="CO₂ stored"
          value={P.co2.toLocaleString()}
          unit=" t"
          sub={periodPhrase}
          delta={"+" + dCo2.pct + "%"}
          deltaDir="up"
          spark={D.monthly.co2.slice(-6)}
          sparkColor="oklch(0.5 0.12 150)"
        />
        <KPI
          icon={TrendingUp}
          label="Verified value"
          value={compactTZS(P.verifiedTZS)}
          sub={`${roi}% above what we spent`}
          delta={"+" + dVer.pct + "%"}
          deltaDir="up"
        />
      </div>

      {exec && (
        <>
          <SectionTitle>The short version</SectionTitle>
          <div className="fade-in rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card p-6 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start">
              <div className="min-w-0 flex-[1_1_280px]">
                <p className="font-serif text-xl leading-[1.55] text-ink [text-wrap:pretty]">
                  {D.company.description ?? (
                    <>
                      {D.company.name} has {P.activeProjects} project{P.activeProjects !== 1 ? "s" : ""} running.
                      So far they&apos;ve put <b>{P.trees.toLocaleString()} trees</b> in the ground
                      with a verified value of <b>{compactTZS(P.verifiedTZS)}</b>.
                    </>
                  )}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => {
                      const r = D.reports[0];
                      const p = D.projects.find((pr) => pr.id === r?.projectId);
                      if (r && p) printReportPDF(r, p);
                      else go({ screen: "reports", role });
                    }}
                  >
                    <Download size={16} strokeWidth={1.9} /> Download the one-pager (PDF)
                  </Button>
                  <Button variant="ghost" onClick={() => go({ screen: "reports" })}>
                    <FileText size={16} strokeWidth={1.9} /> See all reports
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mtile min-w-[130px] rounded-[var(--r-md)] bg-tile p-4 text-center">
                  <DonutStat value={P.survival} sub="alive" />
                  <div className="mt-1.5 text-[12.5px] text-muted">Trees still alive</div>
                </div>
                <div className="mtile min-w-[130px] rounded-[var(--r-md)] bg-tile p-4 text-center">
                  <DonutStat value={0.94} color="oklch(0.62 0.11 80)" sub="sure" />
                  <div className="mt-1.5 text-[12.5px] text-muted">How sure the checks are</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <SectionTitle>Impact over time</SectionTitle>
      <ImpactOverTime impactRange={impactRange} setImpactRange={setImpactRange} />

      {exec ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
                  What we spent vs what it&apos;s worth
                </h3>
                <span className="text-[12.5px] font-medium text-muted">{roi}% ahead</span>
              </div>
              <div className="p-6">
                <BarCompareChart data={compareData} />
                <div className="mt-3 flex justify-center gap-5">
                  <span className="flex items-center gap-2 text-[12.5px] text-muted">
                    <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.62_0.07_152)]" /> Spent
                  </span>
                  <span className="flex items-center gap-2 text-[12.5px] text-muted">
                    <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.5_0.12_150)]" /> Verified worth
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
              <div className="border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
                  Where the work is happening
                </h3>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  Sentinel-2 · live NDVI mosaic
                </p>
              </div>
              <div className="p-6">
                <VegetationMap
                  lat={siteCenter(allSites).lat}
                  lng={siteCenter(allSites).lng}
                  height={300}
                  label="Portfolio · NDVI"
                  zoom={12}
                  radius={1200}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <SectionTitle
            action={
              <button
                className="inline-flex items-center gap-1.5 border-0 bg-transparent text-[13px] font-semibold text-muted hover:text-ink"
                onClick={() => go({ screen: "reports" })}
              >
                All reports →
              </button>
            }
          >
            How the projects are doing
          </SectionTitle>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
                  Trees planted and how many survived
                </h3>
                <span className="text-[12.5px] text-muted">by project</span>
              </div>
              <div className="p-6">
                <TreesSurvivalChart data={treesData} />
                <div className="mt-3 flex justify-center gap-5">
                  <span className="flex items-center gap-2 text-[12.5px] text-muted">
                    <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.74_0.05_152)]" /> Trees planted
                  </span>
                  <span className="flex items-center gap-2 text-[12.5px] text-muted">
                    <span className="h-3.5 w-3.5 rounded-[3px] bg-[oklch(0.66_0.12_78)]" /> Still alive %
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">Tree cover gain</h3>
                <span className="text-[12.5px] text-muted">+{P.canopyDelta}% so far</span>
              </div>
              <div className="p-6">
                <AreaTrend
                  series={P.canopyTrend}
                  labels={P.quarters}
                  suffix="%"
                  height={230}
                  color="oklch(0.5 0.12 150)"
                  fill="oklch(0.5 0.12 150)"
                />
                <div className="mt-3 text-center text-[12.5px] text-muted">
                  How much more tree cover there is since each project started
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
            <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">Planting sites</h3>
                <span className="text-[12.5px] text-muted">
                  {allSites.length} sites · {P.locations} locations
                </span>
              </div>
              <div className="p-6">
                <SiteMap sites={allSites} height={320} activeName={hover?.name} onHover={setHover} />
              </div>
            </div>
            <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
                  Latest satellite updates
                </h3>
                <span className="text-[12.5px] text-muted">saved snapshots</span>
              </div>
              <div>
                {D.reports.slice(0, 4).map((r) => {
                  const p = D.projectById(r.projectId)!;
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
                        <TrendingUp size={18} strokeWidth={1.9} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <b className="text-[13.5px]">{p.short}</b>
                          {r.status === "new" && <Badge kind="new">New</Badge>}
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-muted">
                          Tree cover {up ? "+" : ""}
                          {r.trigger.delta}% · {r.generated.split(" · ")[0]}
                        </div>
                      </div>
                      <TrendingUp size={16} strokeWidth={2} className="text-muted-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <SectionTitle>What we spent vs what it&apos;s worth</SectionTitle>
          <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.06)] bg-card shadow-[var(--shadow)]">
            <div className="p-6">
              <BarCompareChart data={compareData} />
              <div className="mt-3 flex justify-center gap-5">
                <span className="flex items-center gap-2 text-[12.5px] text-muted">
                  <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.62_0.07_152)]" /> Spent ·{" "}
                  {compactTZS(P.investedTZS)}
                </span>
                <span className="flex items-center gap-2 text-[12.5px] text-muted">
                  <span className="h-3 w-3 rounded-[3px] bg-[oklch(0.5_0.12_150)]" /> Verified worth ·{" "}
                  {compactTZS(P.verifiedTZS)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="h-[30px]" />
    </div>
  );
}
