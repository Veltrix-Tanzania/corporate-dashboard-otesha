import { NextResponse } from "next/server";
import { initEarthEngine, latestNdvi, NDVI_VIS } from "@/lib/earth-engine";

export const runtime = "nodejs";

// In-memory cache: tile URLs are stable for ~1 h, computing one takes 5–15 s cold
const cache = new Map<string, { url: string; expires: number }>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) {
    return NextResponse.json({ tileUrl: hit.url, cached: true });
  }

  try {
    await initEarthEngine();
    const { ndvi } = latestNdvi(lat, lng, 1000);

    const tileUrl = await new Promise<string>((resolve, reject) => {
      try {
        ndvi.getMap(NDVI_VIS, (tileObj: any) => {
          if (!tileObj?.urlFormat) {
            reject(new Error("EE getMap returned no urlFormat"));
          } else {
            resolve(tileObj.urlFormat as string);
          }
        });
      } catch (err) {
        reject(err);
      }
    });

    cache.set(key, { url: tileUrl, expires: Date.now() + 60 * 60 * 1000 });
    return NextResponse.json({ tileUrl, cached: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
