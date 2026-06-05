"use client";

import { useEffect, useState } from "react";
import { Briefcase, Check, HardHat } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { Segmented } from "@/components/ui/Segmented";
import { SettingRow } from "@/components/ui/SettingRow";
import { Toggle } from "@/components/ui/Toggle";
import { useSettings } from "@/hooks/useSettings";
import type { ReportSettings } from "@/lib/api/types";
import type { Role, Route } from "@/lib/types";

export function SettingsScreen({
  role,
  go,
}: {
  role: Role;
  go: (next: Partial<Route>) => void;
}) {
  const { settings, loading, saving, error, save, reload } = useSettings();
  const [draft, setDraft] = useState<ReportSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setDraft(settings);
  }, [settings]);

  if (loading || !draft) {
    return <LoadingState label="Loading settings…" />;
  }

  if (error && !settings) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  const toggle = (k: keyof ReportSettings["toggles"]) =>
    setDraft((v) => (v ? { ...v, toggles: { ...v.toggles, [k]: !v.toggles[k] } } : v));

  const handleSave = async () => {
    const ok = await save(draft);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-[1180px]">
      <div className="mb-[22px] flex items-end justify-between gap-5">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.11em] text-muted">Account</div>
          <h1 className="mt-1.5 font-serif text-[30px] font-semibold leading-[1.05] tracking-[-0.01em]">
            Report settings
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Decide how often we save a satellite image, what each update shows, and who gets it.
          </p>
        </div>
        <RoleToggle role={role} setRole={(r) => go({ screen: "settings", role: r })} />
      </div>

      {error && <p className="mb-4 text-sm text-[#8a3320]">{error}</p>}

      <div className="grid grid-cols-[1.3fr_1fr] gap-5">
        <div className="grid gap-5">
          <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card shadow-[var(--shadow)]">
            <div className="flex items-center justify-between border-b border-line px-6 py-[18px]">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">Satellite images</h3>
              <span className="text-[12.5px] text-muted">Sentinel-2 · ~5 day revisit</span>
            </div>
            <div className="p-6">
              <div className="mb-2.5 text-[12.5px] text-muted">
                How often we save a fresh image of your projects
              </div>
              <Segmented
                options={["Every pass", "Monthly", "Quarterly"]}
                value={draft.cadence}
                onChange={(cadence) =>
                  setDraft((v) =>
                    v ? { ...v, cadence: cadence as ReportSettings["cadence"] } : v,
                  )
                }
                fullWidth
                tileBg
              />
            </div>
            <SettingRow
              title="Save an update each time"
              desc="Turn each saved image into a short, shareable update."
            >
              <Badge kind="mut">Always</Badge>
            </SettingRow>
          </div>

          <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card shadow-[var(--shadow)]">
            <div className="border-b border-line px-6 py-[18px]">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
                What each update shows
              </h3>
            </div>
            <SettingRow
              title="Trees planted & survival"
              desc="How many trees are in the ground and how many are still alive."
            >
              <Toggle on={draft.toggles.trees} onClick={() => toggle("trees")} />
            </SettingRow>
            <SettingRow
              title="Tree cover change"
              desc="How much greener the satellite image looks versus the last one."
            >
              <Toggle on={draft.toggles.cover} onClick={() => toggle("cover")} />
            </SettingRow>
            <SettingRow title="CO₂ stored" desc="An estimate of the carbon captured so far.">
              <Toggle on={draft.toggles.co2} onClick={() => toggle("co2")} />
            </SettingRow>
            <SettingRow
              title="Verified value"
              desc="The value of the verified impact, in TZS and USD."
            >
              <Toggle on={draft.toggles.value} onClick={() => toggle("value")} />
            </SettingRow>
          </div>

          <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card shadow-[var(--shadow)]">
            <div className="border-b border-line px-6 py-[18px]">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">
                How updates are shared
              </h3>
            </div>
            <SettingRow
              title="Dashboard card"
              desc="Always on — shows up in your portfolio overview."
            >
              <Badge kind="mut">Always</Badge>
            </SettingRow>
            <SettingRow
              title="PDF for ESG filing"
              desc="A formatted PDF you can file to your ESG register."
            >
              <Toggle on={draft.toggles.pdf} onClick={() => toggle("pdf")} />
            </SettingRow>
            <SettingRow title="Email digest" desc="A short email when a new update is saved.">
              <Toggle on={draft.toggles.email} onClick={() => toggle("email")} />
            </SettingRow>
          </div>
        </div>

        <div className="grid content-start gap-5">
          <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card shadow-[var(--shadow)]">
            <div className="border-b border-line px-6 py-[18px]">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">Who gets updates</h3>
            </div>
            <div className="grid gap-4 p-6">
              <div className="rounded-[var(--r-md)] bg-tile p-4">
                <div className="flex items-center gap-2">
                  <HardHat size={16} strokeWidth={1.9} className="text-green-deep" />
                  <b className="text-[13.5px]">Sustainability managers</b>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-normal text-muted">
                  Get the fuller picture — the saved image, site-by-site numbers and the ESG-ready PDF.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-tile px-2.5 py-1 text-[11.5px] font-semibold text-ink-2">
                    2 people
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-tile px-2.5 py-1 text-[11.5px] font-semibold text-ink-2">
                    More detail
                  </span>
                </div>
              </div>
              <div className="rounded-[var(--r-md)] bg-tile p-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={15} strokeWidth={1.9} className="text-green-deep" />
                  <b className="text-[13.5px]">Decision makers</b>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-normal text-muted">
                  Get the short version — a plain-language headline, the key numbers and a one-pager.
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-tile px-2.5 py-1 text-[11.5px] font-semibold text-ink-2">
                    3 people
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-tile px-2.5 py-1 text-[11.5px] font-semibold text-ink-2">
                    Short version
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[var(--r-lg)] border border-[rgba(20,50,40,.04)] bg-card shadow-[var(--shadow)]">
            <div className="border-b border-line px-6 py-[18px]">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-ink-2">Email digest</h3>
            </div>
            <div className="p-6">
              <Segmented
                options={["Instant", "Weekly", "Monthly"]}
                value={draft.digest}
                onChange={(digest) =>
                  setDraft((v) =>
                    v ? { ...v, digest: digest as ReportSettings["digest"] } : v,
                  )
                }
                fullWidth
                tileBg
              />
              <p className="mt-3 text-[12.5px] leading-normal text-muted">
                How often we bundle saved updates into an email. Big changes always send straight away.
              </p>
            </div>
          </div>

          <Button variant="primary" className="w-full" onClick={handleSave} disabled={saving}>
            <Check size={16} strokeWidth={2.2} />
            {saving ? "Saving…" : saved ? "Saved" : "Save settings"}
          </Button>
        </div>
      </div>
      <div className="h-[30px]" />
    </div>
  );
}
