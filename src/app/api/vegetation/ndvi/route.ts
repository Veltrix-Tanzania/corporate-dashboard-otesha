import { NextResponse } from "next/server";
import ee from "@google/earthengine";
import { initEarthEngine, latestNdvi } from "@/lib/earth-engine";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const radius = Math.min(Math.max(parseFloat(searchParams.get("radius") ?? "200"), 10), 1000);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  try {
    await initEarthEngine();
    const { area, ndvi } = latestNdvi(lat, lng, radius);

    const result = await new Promise<Record<string, number | null>>((resolve, reject) => {
      ndvi
        .reduceRegion({
          reducer: ee.Reducer.mean(),
          geometry: area,
          scale: 10,
        })
        .evaluate((val: Record<string, number | null>, err: unknown) => {
          if (err) reject(err);
          else resolve(val);
        });
    });

    const value = result?.NDVI ?? null;
    const status =
      value == null ? "unknown" : value > 0.5 ? "healthy" : value > 0.3 ? "sparse" : "bare";

    return NextResponse.json({ lat, lng, ndvi: value, status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
