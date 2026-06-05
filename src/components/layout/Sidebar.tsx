"use client";

import {
  FileText,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  TreePine,
  FolderKanban,
} from "lucide-react";
import { usePortal } from "@/providers/PortalProvider";
import { clearAuth } from "@/lib/auth";
import type { Route, Screen } from "@/lib/types";

type NavItem = { id: Screen; icon: React.ReactNode; label: string; badge?: number };

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
    { id: "dashboard", icon: <LayoutDashboard size={18} strokeWidth={1.8} />, label: "Dashboard" },
    { id: "projects", icon: <FolderKanban size={18} strokeWidth={1.8} />, label: "Projects" },
    { id: "reports", icon: <FileText size={18} strokeWidth={1.8} />, label: "Reports", badge: newCount },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[var(--sidebar-w)] flex-col border-r border-[rgba(255,255,255,.05)] bg-forest text-on-forest">
      <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,.06)] px-5 py-[22px]">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-full border border-[rgba(255,255,255,.12)] bg-forest-2 text-[#bcd3c2]">
          <TreePine size={20} strokeWidth={1.6} />
        </div>
        <div>
          <b className="text-[15px] tracking-[0.1px]">{loading ? "…" : company.portal}</b>
          <span className="mt-px block text-xs text-on-forest-mut">Corporate Portal</span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 p-3.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => go({ screen: item.id })}
            className={`flex items-center gap-3 rounded-[var(--r-sm)] border border-transparent px-3 py-2.5 text-sm font-medium transition-colors ${
              navKey === item.id
                ? "bg-forest-pill text-white"
                : "text-[#c6d8cb] hover:bg-[rgba(255,255,255,.045)] hover:text-[#e6f0e8]"
            }`}
          >
            {item.icon}
            {item.label}
            {item.badge ? (
              <span className="ml-auto rounded-full bg-gold px-1.5 py-px text-[10.5px] font-bold text-[#3a2a00]">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
        <div className="px-3 pb-1.5 pt-3.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-on-forest-mut">
          Account
        </div>
        <button
          onClick={() => go({ screen: "settings" })}
          className={`flex items-center gap-3 rounded-[var(--r-sm)] border border-transparent px-3 py-2.5 text-sm font-medium transition-colors ${
            navKey === "settings"
              ? "bg-forest-pill text-white"
              : "text-[#c6d8cb] hover:bg-[rgba(255,255,255,.045)] hover:text-[#e6f0e8]"
          }`}
        >
          <SlidersHorizontal size={18} strokeWidth={1.8} />
          Report settings
        </button>
      </nav>

      <div className="mt-auto border-t border-[rgba(255,255,255,.06)] p-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-forest-pill text-xs font-bold text-[#dcecdf]">
            AM
          </div>
          <div className="min-w-0">
            <b className="text-[13px]">{company.user}</b>
            <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-on-forest-mut">
              {company.email}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            clearAuth();
            window.location.href = "/login";
          }}
          className="mt-3.5 flex items-center gap-2.5 px-1 py-1.5 text-[13px] text-[#9bb3a4] hover:text-[#d7e6da] transition-colors"
        >
          <LogOut size={16} strokeWidth={1.8} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
