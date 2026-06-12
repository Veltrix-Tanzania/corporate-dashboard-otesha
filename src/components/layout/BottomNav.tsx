"use client";

import { FileText, FolderKanban, Gauge, Globe, LayoutDashboard } from "lucide-react";
import type { Route, Screen } from "@/lib/types";

const NAV_ITEMS: { id: Screen; icon: React.ReactNode; label: string }[] = [
  { id: "dashboard", icon: <LayoutDashboard size={20} strokeWidth={1.9} />, label: "Dashboard" },
  { id: "projects", icon: <FolderKanban size={20} strokeWidth={1.9} />, label: "Projects" },
  { id: "reports", icon: <FileText size={20} strokeWidth={1.9} />, label: "Reports" },
  { id: "emissions", icon: <Gauge size={20} strokeWidth={1.9} />, label: "Emissions" },
  { id: "showcase", icon: <Globe size={20} strokeWidth={1.9} />, label: "Explore" },
];

export function BottomNav({
  navKey,
  go,
  newCount,
}: {
  navKey: Screen;
  go: (next: Partial<Route>) => void;
  newCount: number;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[rgba(255,255,255,.07)] bg-forest/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      style={{ WebkitBackdropFilter: "blur(12px)" }}
    >
      {NAV_ITEMS.map((item) => {
        const active = navKey === item.id;
        const badge = item.id === "reports" && newCount > 0 ? newCount : null;

        return (
          <button
            key={item.id}
            onClick={() => go({ screen: item.id })}
            className="relative flex flex-1 flex-col items-center gap-0.75 py-2.5"
          >
            <span
              className={`relative flex h-9 w-9 items-center justify-center rounded-sm transition-all duration-200 ${
                active
                  ? "bg-[rgba(255,255,255,.12)] text-[#9de0b0] shadow-[inset_0_1px_1px_rgba(255,255,255,.08)]"
                  : "text-[#6a8e7b]"
              }`}
            >
              {item.icon}
              {badge && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold px-0.75 text-[8px] font-bold leading-none text-[#3a2a00]">
                  {badge}
                </span>
              )}
            </span>

            <span
              className={`text-[9.5px] font-semibold tracking-wide transition-colors duration-200 ${
                active ? "text-white" : "text-[#5a7a69]"
              }`}
            >
              {item.label}
            </span>

            {active && (
              <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[oklch(0.72_0.15_150)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
