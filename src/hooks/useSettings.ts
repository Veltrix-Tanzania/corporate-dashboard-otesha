"use client";

import { useCallback, useEffect, useState } from "react";
import { portalApi } from "@/lib/api/portal";
import { ApiError } from "@/lib/api/client";
import type { ReportSettings } from "@/lib/api/types";

export function useSettings() {
  const [settings, setSettings] = useState<ReportSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await portalApi.getSettings();
      setSettings(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (next: ReportSettings) => {
    setSaving(true);
    setError(null);
    try {
      const data = await portalApi.saveSettings(next);
      setSettings(data);
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to save settings");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, loading, saving, error, save, reload: load };
}
