import type { Site } from "./types";

export function siteCenter(sites: Site[]) {
  if (!sites.length) return { lat: -6.37, lng: 34.89 };
  const lat = sites.reduce((a, s) => a + s.lat, 0) / sites.length;
  const lng = sites.reduce((a, s) => a + s.lng, 0) / sites.length;
  return { lat, lng };
}

export function formatCoords(lat: number, lng: number) {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(3)}°${latDir}, ${Math.abs(lng).toFixed(3)}°${lngDir}`;
}
