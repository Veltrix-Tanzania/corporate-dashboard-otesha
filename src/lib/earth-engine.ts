import ee from "@google/earthengine";
import { getGcpKey } from "./gcp-key";

const NDVI_START_DATE = "2023-01-01";

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// Singleton — one init per server process; failed init resets so next request retries
let initPromise: Promise<void> | null = null;

export function initEarthEngine(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = new Promise<void>((resolve, reject) => {
    const key = process.env.GCP_SERVICE_ACCOUNT
      ? JSON.parse(process.env.GCP_SERVICE_ACCOUNT)
      : getGcpKey();
    ee.data.authenticateViaPrivateKey(
      key,
      () =>
        ee.initialize(
          null,
          null,
          () => resolve(),
          (err: unknown) => {
            initPromise = null;
            reject(err);
          },
        ),
      (err: unknown) => {
        initPromise = null;
        reject(err);
      },
    );
  });
  return initPromise;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function maskClouds(image: any) {
  return image
    .updateMask(image.select("MSK_CLDPRB").lt(20))
    .divide(10000)
    .copyProperties(image, ["system:time_start"]);
}

export const NDVI_VIS = {
  min: 0,
  max: 0.8,
  palette: ["white", "yellow", "green", "darkgreen"],
};

/**
 * Builds a cloud-free NDVI mosaic for the given point.
 * Returns { area, ndvi } — both are EE objects, ready for getMap / reduceRegion.
 *
 * Note: EE geometry order is [lng, lat]; Leaflet/props order is [lat, lng].
 * The swap happens only here, once.
 */
export function latestNdvi(lat: number, lng: number, bufferMeters = 500) {
  const area = ee.Geometry.Point([lng, lat]).buffer(bufferMeters);

  const collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .filterBounds(area)
    .filterDate(NDVI_START_DATE, tomorrow())
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 30))
    .map(maskClouds);

  // Mosaic (newest-on-top) gives full coverage where the latest pass has cloud holes
  const composite = ee.Image(collection.sort("system:time_start").mosaic());
  const ndvi = composite.normalizedDifference(["B8", "B4"]).rename("NDVI");

  return { area, ndvi };
}
