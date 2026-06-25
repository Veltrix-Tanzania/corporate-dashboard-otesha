"use client";

import {
  FileText,
  FolderKanban,
  Gauge,
  Globe,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { usePortal } from "@/providers/PortalProvider";
import { clearAuth } from "@/lib/auth";
import { BRAND_NAME, BRAND_PORTAL_SUBTITLE, BRAND_PROJECTS_LABEL } from "@/lib/brand";
import type { Route, Screen } from "@/lib/types";

type NavItem = { id: Screen; icon: React.ReactNode; label: string; badge?: number };

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function Sidebar({
  navKey,
  go,
  newCount,
  loading,
}: {
  navKey: Screen;
  go: (next: Partial<Route>) => void;
  newCount: number;
  loading?: boolean;
}) {
  const { company } = usePortal();

  const items: NavItem[] = [
    { id: "dashboard", icon: <LayoutDashboard size={17} strokeWidth={1.9} />, label: "Dashboard" },
    { id: "projects", icon: <FolderKanban size={17} strokeWidth={1.9} />, label: "My Projects" },
    { id: "reports", icon: <FileText size={17} strokeWidth={1.9} />, label: "Reports", badge: newCount },
    { id: "emissions", icon: <Gauge size={17} strokeWidth={1.9} />, label: "Emissions" },
    { id: "showcase", icon: <Globe size={17} strokeWidth={1.9} />, label: BRAND_PROJECTS_LABEL },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-(--sidebar-w) flex-col border-r border-[rgba(255,255,255,.05)] bg-forest text-on-forest md:flex">
      {/* Logo area */}
      <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,.06)] px-5 py-5.25">
        <BrandLogo size={36} className="flex-none shadow-[0_2px_8px_rgba(0,0,0,.35)]" />
        <div>
          <b className="text-[14.5px] tracking-[0.15px] text-[#e8f2ea]">
            {loading ? "…" : BRAND_NAME}
          </b>
          <span className="mt-px block text-[11px] text-on-forest-mut">{BRAND_PORTAL_SUBTITLE}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-3">
        <div className="mb-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-on-forest-mut/60">
          Navigation
        </div>
        {items.map((item) => {
          const active = navKey === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go({ screen: item.id })}
              className={`group relative flex items-center gap-2.5 rounded-(--r-sm) px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 ${
                active
                  ? "bg-[rgba(255,255,255,.1)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,.06)]"
                  : "text-[#b8cec2] hover:bg-[rgba(255,255,255,.05)] hover:text-[#e2ede5]"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-[oklch(0.72_0.15_150)]" />
              )}
              <span className={active ? "text-[#9de0b0]" : "text-[#7a9e8a] group-hover:text-[#a8c8b4]"}>
                {item.icon}
              </span>
              {item.label}
              {item.badge ? (
                <span className="ml-auto rounded-full bg-gold px-1.5 py-px text-[10px] font-bold text-[#3a2a00]">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="mt-auto border-t border-[rgba(255,255,255,.06)] p-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8.5 w-8.5 flex-none place-items-center rounded-full bg-linear-to-br from-[#2d5a44] to-[#1a3a2c] text-[11px] font-bold tracking-wide text-[#9de0b0] ring-1 ring-[rgba(255,255,255,.1)]">
            {getInitials(company.user || "U")}
          </div>
          <div className="min-w-0">
            <b className="block truncate text-[13px] text-[#e2ede5]">{company.user}</b>
            <span className="block truncate text-[11px] text-on-forest-mut">
              {company.email}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            clearAuth();
            window.location.href = "/login";
          }}
          className="mt-3.5 flex items-center gap-2 px-1 py-1 text-[12.5px] text-on-forest-mut transition-colors hover:text-[#d7e6da]"
        >
          <LogOut size={14} strokeWidth={1.9} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
