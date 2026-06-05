"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_ROUTE, ROUTE_STORAGE_KEY } from "@/lib/constants";
import type { Role, Route, Screen } from "@/lib/types";

function loadRoute(): Route {
  if (typeof window === "undefined") return DEFAULT_ROUTE;
  try {
    const stored = localStorage.getItem(ROUTE_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Route) : DEFAULT_ROUTE;
  } catch {
    return DEFAULT_ROUTE;
  }
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(DEFAULT_ROUTE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRoute(loadRoute());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(route));
  }, [route, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const main = document.querySelector(".main");
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [route.screen, route.id, hydrated]);

  const go = useCallback((next: Partial<Route> & { screen?: Screen; role?: Role }) => {
    setRoute((cur) => ({ ...cur, ...next, role: next.role ?? cur.role }));
  }, []);

  const navKey: Screen =
    route.screen === "report"
      ? "reports"
      : route.screen === "project"
        ? "projects"
        : route.screen;

  return { route, role: route.role, go, navKey, hydrated };
}
