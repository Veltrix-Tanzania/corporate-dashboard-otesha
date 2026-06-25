"use client";

import { useMemo, useState } from "react";
import {
  Globe,
  Leaf,
  MapPin,
  Search,
  TreePine,
} from "lucide-react";
import { Co2Icon } from "@/components/ui/Co2Icon";
import { Badge } from "@/components/ui/Badge";
import { usePortal } from "@/providers/PortalProvider";
import { BRAND_NAME, BRAND_PROJECTS_LABEL } from "@/lib/brand";
import type { Project, Role, Route } from "@/lib/types";

// ─── Status helpers ────────────────────────────────────────────────────────────

function statusKind(status: string): "active" | "new" | "mut" {
  const s = status.toLowerCase();
  if (s.includes("active") || s.includes("grow") || s.includes("ongoing")) return "active";
  if (s.includes("complet") || s.includes("done")) return "mut";
  return "new";
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  onView,
}: {
  project: Project;
  onView: () => void;
}) {
  const survPct = Math.round(project.survival * 100);
  const co2 = project.co2.toLocaleString();

  return (
    <div className="group flex flex-col overflow-hidden rounded-(--r-lg) border border-[rgba(20,50,40,.06)] bg-card shadow-(--shadow) transition-shadow hover:shadow-[0_4px_20px_rgba(20,50,40,.12)]">
      {/* Accent header strip */}
      <div className="relative h-2.5 w-full bg-linear-to-r from-[oklch(0.55_0.13_150)] to-[oklch(0.45_0.12_160)]">
        <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(90deg,transparent,transparent_18px,rgba(255,255,255,.35)_18px,rgba(255,255,255,.35)_19px)]" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Top row */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 flex-none place-items-center rounded-sm bg-[#dff0e4] text-green-deep">
                <TreePine size={15} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-bold text-ink">{project.name}</div>
                <div className="flex items-center gap-1 text-[11.5px] text-muted">
                  <MapPin size={10} strokeWidth={1.8} />
                  {project.region}
                </div>
              </div>
            </div>
          </div>
          <Badge kind={statusKind(project.status)}>
            {project.status}
          </Badge>
        </div>

        {/* Metrics grid */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          {[
            { icon: TreePine, label: "Trees", value: project.trees.toLocaleString() },
            { icon: Co2Icon, label: "CO₂ stored", value: `${co2} t` },
            { icon: Leaf, label: "Survival", value: `${survPct}%` },
            { icon: Globe, label: "Species", value: project.species.toString() },
          ].map((m) => (
            <div key={m.label} className="rounded-(--r-sm) bg-tile px-3 py-2">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-muted">
                <m.icon size={10} strokeWidth={1.8} />
                {m.label}
              </div>
              <div className="mt-0.5 font-serif text-[17px] font-semibold text-ink">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Blurb */}
        {project.blurb && (
          <p className="mb-4 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
            {project.blurb}
          </p>
        )}

        {/* Survival bar */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
            <span>Survival rate</span>
            <span className="font-semibold text-ok-ink">{survPct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e2ede5]">
            <div
              className="h-full rounded-full bg-[oklch(0.55_0.13_150)] transition-all duration-700"
              style={{ width: `${survPct}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[11px] text-muted">
            {project.locations} site{project.locations !== 1 ? "s" : ""} · started {project.started}
          </span>
          <button
            onClick={onView}
            className="rounded-lg border border-[rgba(20,50,40,.12)] bg-[#eaf4ec] px-3 py-1.5 text-[12px] font-semibold text-green-deep transition-all hover:bg-[#d8eedd] hover:border-[rgba(20,50,40,.2)]"
          >
            View details →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ShowcaseScreen({
  role,
  go,
}: {
  role: Role;
  go: (next: Partial<Route>) => void;
}) {
  const { projects, portfolio } = usePortal();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Collect unique statuses
  const statuses = useMemo(() => {
    const seen = new Set<string>();
    projects.forEach((p) => seen.add(p.status));
    return Array.from(seen);
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.region.toLowerCase().includes(query.toLowerCase()) ||
        p.blurb?.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || p.status.toLowerCase() === activeFilter.toLowerCase();
      return matchesQuery && matchesFilter;
    });
  }, [projects, query, activeFilter]);

  return (
    <div className="mx-auto max-w-295">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(20,50,40,.08)] bg-card px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted shadow-sm">
          <Globe size={11} strokeWidth={2} className="text-green-deep" />
          Project directory
        </div>
        <h1 className="mt-2 font-serif text-[26px] font-semibold leading-[1.05] tracking-[-0.015em] text-ink md:text-[30px]">
          {BRAND_PROJECTS_LABEL}
        </h1>
        <p className="mt-1 text-[13.5px] text-muted">
          All active and completed reforestation projects in the {BRAND_NAME} portfolio.
        </p>
      </div>

      {/* Portfolio stats banner */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {[
          { label: "Total projects", value: projects.length.toString(), icon: Globe },
          { label: "Trees planted", value: portfolio.trees.toLocaleString(), icon: TreePine },
          { label: "CO₂ sequestered", value: `${portfolio.co2.toLocaleString()} t`, icon: Co2Icon },
          { label: "Avg survival", value: `${Math.round(portfolio.survival * 100)}%`, icon: Leaf },
        ].map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-(--r-lg) border border-[rgba(20,50,40,.06)] bg-card p-5 shadow-(--shadow)"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[oklch(0.55_0.13_150)]/40 to-transparent" />
            <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-muted">
              <stat.icon size={11} strokeWidth={1.8} />
              {stat.label}
            </div>
            <div className="font-serif text-[26px] font-semibold leading-none tracking-[-0.015em] text-ink">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, region…"
            className="w-full rounded-lg border border-line bg-card py-2 pl-9 pr-4 text-[13px] text-ink placeholder:text-muted focus:border-green-deep focus:outline-none focus:ring-1 focus:ring-green-deep"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...statuses].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold capitalize transition-all ${
                activeFilter === f
                  ? "bg-ink text-[#eaf3ec] shadow-sm"
                  : "border border-line bg-card text-muted hover:text-ink"
              }`}
            >
              {f === "all" ? `All (${projects.length})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted">
          <TreePine size={36} strokeWidth={1.4} className="text-muted-2" />
          <p className="text-[14px] font-medium">No projects match your search.</p>
          <button
            onClick={() => { setQuery(""); setActiveFilter("all"); }}
            className="text-[13px] font-semibold text-green-deep hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => go({ screen: "project", id: project.id, role })}
            />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="mt-5 text-center text-[12px] text-muted">
          Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
      )}

      <div className="h-7.5" />
    </div>
  );
}
