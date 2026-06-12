"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Loader, Satellite, TriangleAlert } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon paths broken by Webpack/Turbopack
delete (L.Icon.Default.prototype as typeof L.Icon.Default.prototype & { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type NdviResult = {
  tileUrl: string | null;
  ndvi: number | null;
  status: string;
  loading: boolean;
  error: string | null;
};

function statusColor(status: string) {
  if (status === "healthy") return "text-ok-ink";
  if (status === "sparse") return "text-warn-ink";
  if (status === "bare") return "text-[#8a3320]";
  return "text-muted";
}

export function VegetationMapLeaflet({
  lat,
  lng,
  height = 320,
  label,
  zoom = 14,
  radius = 500,
}: {
  lat: number;
  lng: number;
  height?: number;
  label?: string;
  zoom?: number;
  radius?: number;
}) {
  const [state, setState] = useState<NdviResult>({
    tileUrl: null,
    ndvi: null,
    status: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ tileUrl: null, ndvi: null, status: "", loading: true, error: null });

    Promise.all([
      fetch(`/api/vegetation/tiles?lat=${lat}&lng=${lng}`).then((r) => r.json()),
      fetch(`/api/vegetation/ndvi?lat=${lat}&lng=${lng}&radius=${radius}`).then((r) => r.json()),
    ])
      .then(([tiles, ndviData]) => {
        if (cancelled) return;
        setState({
          tileUrl: tiles.tileUrl ?? null,
          ndvi: typeof ndviData.ndvi === "number" ? ndviData.ndvi : null,
          status: ndviData.status ?? "unknown",
          loading: false,
          error: tiles.error ?? ndviData.error ?? null,
        });
      })
      .catch((err) => {
        if (!cancelled)
          setState((s) => ({ ...s, loading: false, error: err?.message ?? "Failed to load" }));
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, radius]);

  const colorClass = statusColor(state.status);

  return (
    <div className="relative overflow-hidden rounded-[var(--r-md)]" style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        {/* Real NDVI raster overlay from Earth Engine */}
        {state.tileUrl && <TileLayer url={state.tileUrl} opacity={0.82} />}

        {/* Project boundary circle */}
        <Circle
          center={[lat, lng]}
          radius={radius}
          pathOptions={{
            color: "#2f5a3e",
            weight: 2,
            fillColor: "#2f5a3e",
            fillOpacity: 0.04,
            dashArray: "6 4",
          }}
        />

        <Marker position={[lat, lng]}>
          {label && (
            <Tooltip direction="top" permanent opacity={1}>
              <span className="text-[11px] font-bold">{label}</span>
            </Tooltip>
          )}
        </Marker>
      </MapContainer>

      {/* Loading overlay */}
      {state.loading && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-2 bg-tile/80 backdrop-blur-sm">
          <Loader size={22} strokeWidth={1.8} className="animate-spin text-green-deep" />
          <span className="text-[13px] font-semibold text-ink-2">Loading satellite data…</span>
          <span className="text-[12px] text-muted">First request takes 10–15 s (Earth Engine cold start)</span>
        </div>
      )}

      {/* NDVI value badge — top-right */}
      {!state.loading && state.ndvi !== null && (
        <div className="absolute right-3.5 top-3.5 z-[500] flex flex-col gap-1 rounded-[10px] bg-[rgba(18,38,28,.88)] p-2.5 text-[11px] text-[#cfe3d4] backdrop-blur-sm">
          <div className={`font-bold text-[13px] ${colorClass}`}>
            NDVI {state.ndvi.toFixed(3)}
          </div>
          <div className="capitalize text-[#9dc8b0]">{state.status}</div>
          <div className="mt-1 space-y-0.5 border-t border-[rgba(255,255,255,.08)] pt-1.5 text-[10.5px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "darkgreen" }} /> Dense canopy
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "green" }} /> Regrowth
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "yellow" }} /> Sparse
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "white", border: "1px solid rgba(255,255,255,.2)" }} /> Bare
            </div>
          </div>
        </div>
      )}

      {/* Error chip */}
      {state.error && !state.loading && (
        <div className="absolute right-3.5 top-3.5 z-[500] flex items-center gap-2 rounded-full bg-[rgba(139,51,32,.85)] px-3 py-1.5 text-[11.5px] font-semibold text-white backdrop-blur-sm">
          <TriangleAlert size={13} strokeWidth={2} />
          Satellite data unavailable
        </div>
      )}

      {/* Bottom label */}
      <div className="pointer-events-none absolute bottom-3.5 left-3.5 z-[500] flex items-center gap-2 rounded-full bg-[rgba(18,38,28,.82)] px-3 py-1.5 text-xs font-semibold text-[#dcebdf] backdrop-blur-sm">
        <Satellite size={13} strokeWidth={2} />
        {label ?? "Satellite · NDVI"}
      </div>
    </div>
  );
}
