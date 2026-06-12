import dynamic from "next/dynamic";

const VegetationMapLeaflet = dynamic(
  () => import("./VegetationMapLeaflet").then((m) => m.VegetationMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-[var(--r-md)] bg-tile text-sm text-muted"
        style={{ height: 320 }}
      >
        <span className="text-[13px] font-semibold text-ink-2">Preparing map…</span>
      </div>
    ),
  },
);

export function VegetationMap({
  lat,
  lng,
  height,
  label,
  zoom,
  radius,
}: {
  lat: number;
  lng: number;
  height?: number;
  label?: string;
  zoom?: number;
  radius?: number;
}) {
  return (
    <VegetationMapLeaflet
      lat={lat}
      lng={lng}
      height={height}
      label={label}
      zoom={zoom}
      radius={radius}
    />
  );
}
