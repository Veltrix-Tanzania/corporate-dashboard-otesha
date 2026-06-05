"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { Site } from "@/lib/types";
import { siteCenter } from "@/lib/geo";
import "leaflet/dist/leaflet.css";

function FitBounds({ sites }: { sites: Site[] }) {
  const map = useMap();

  useEffect(() => {
    if (!sites.length) return;
    const bounds = L.latLngBounds(sites.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds.pad(sites.length === 1 ? 0.25 : 0.12));
  }, [sites, map]);

  return null;
}

function pinIcon(size: number, active: boolean) {
  const bg = active ? "#c9a227" : "#2f5a3e";
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function SiteMapLeaflet({
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
  const maxT = Math.max(...sites.map((s) => s.trees), 1);
  const center = siteCenter(sites);

  return (
    <div className="relative overflow-hidden rounded-[var(--r-md)]" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        className="h-full w-full"
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <FitBounds sites={sites} />
        {sites.map((s) => {
          const sz = 12 + (s.trees / maxT) * 26;
          const active = s.name === activeName;
          return (
            <Marker
              key={s.name}
              position={[s.lat, s.lng]}
              icon={pinIcon(sz, active)}
              eventHandlers={{
                mouseover: () => onHover?.(s),
                mouseout: () => onHover?.(null),
              }}
            >
              <Tooltip direction="top" offset={[0, -sz / 2]} opacity={1}>
                <span className="text-[11px] font-bold">
                  {s.name} · {s.trees.toLocaleString()}
                </span>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="pointer-events-none absolute bottom-3.5 left-3.5 z-[500] flex items-center gap-2 rounded-full bg-[rgba(18,38,28,.82)] px-3 py-1.5 text-xs font-semibold text-[#dcebdf] backdrop-blur-sm">
        <MapPin size={13} strokeWidth={2} />
        {sites.length} planting site{sites.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}
