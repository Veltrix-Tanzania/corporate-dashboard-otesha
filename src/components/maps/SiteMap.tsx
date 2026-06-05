"use client";

import dynamic from "next/dynamic";
import type { Site } from "@/lib/types";

const SiteMapLeaflet = dynamic(() => import("./SiteMapLeaflet").then((m) => m.SiteMapLeaflet), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-[var(--r-md)] bg-tile text-sm text-muted"
      style={{ height: 360 }}
    >
      Loading map…
    </div>
  ),
});

export function SiteMap({
  sites = [],
  height = 360,
  activeName,
  onHover,
}: {
  sites?: Site[];
  height?: number;
  activeName?: string | null;
  onHover?: (s: Site | null) => void;
}) {
  return (
    <SiteMapLeaflet sites={sites} height={height} activeName={activeName} onHover={onHover} />
  );
}
