"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import {
  Calculator,
  Car,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileDown,
  FileSpreadsheet,
  Flame,
  Plus,
  Plane,
  Printer,
  TreePine,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePortal } from "@/providers/PortalProvider";
import type { Role, Route } from "@/lib/types";

// ─── DEFRA 2024 conversion factors (kg CO₂e per unit) ─────────────────────────
const FACTORS = {
  diesel: 2.68,
  petrol: 2.31,
  naturalGas: 2.02,
  lpg: 1.56,
  refrigerant: 1_430,
  grid: 0.21,
  hydro: 0.02,
  solar: 0.05,
  gas_gen: 0.49,
  flightShort: 0.255,
  flightLong: 0.195,
  vehicle: 0.17,
} as const;

const KG_PER_TREE_PER_YEAR = 18;

type ElecSource = "grid" | "hydro" | "solar" | "gas_gen";
type Scope1 = { diesel: number; petrol: number; naturalGas: number; lpg: number; refrigerant: number };
type Scope2 = { kwh: number; source: ElecSource };
type Scope3 = { flightShortKm: number; flightLongKm: number; vehicleKm: number };
type CustomRow = { id: string; label: string; value: number; unit: string; factor: number };

const DEFAULT_S1: Scope1 = { diesel: 0, petrol: 0, naturalGas: 0, lpg: 0, refrigerant: 0 };
const DEFAULT_S2: Scope2 = { kwh: 0, source: "grid" };
const DEFAULT_S3: Scope3 = { flightShortKm: 0, flightLongKm: 0, vehicleKm: 0 };

const uid = () => Math.random().toString(36).slice(2, 9);
const customKg = (rows: CustomRow[]) => rows.reduce((a, r) => a + r.value * r.factor, 0);

// ─── Calculation ──────────────────────────────────────────────────────────────

function calc(
  s1: Scope1, s2: Scope2, s3: Scope3,
  cS1: CustomRow[], cS2: CustomRow[], cS3: CustomRow[],
) {
  const scope1 =
    s1.diesel * FACTORS.diesel + s1.petrol * FACTORS.petrol +
    s1.naturalGas * FACTORS.naturalGas + s1.lpg * FACTORS.lpg +
    s1.refrigerant * FACTORS.refrigerant + customKg(cS1);
  const scope2 = s2.kwh * FACTORS[s2.source] + customKg(cS2);
  const scope3 =
    s3.flightShortKm * FACTORS.flightShort + s3.flightLongKm * FACTORS.flightLong +
    s3.vehicleKm * FACTORS.vehicle + customKg(cS3);
  const totalKg = scope1 + scope2 + scope3;
  const totalT = totalKg / 1000;
  const treesNeeded = Math.ceil(totalKg / KG_PER_TREE_PER_YEAR || 0);
  return { scope1, scope2, scope3, totalKg, totalT, treesNeeded };
}

// ─── CSV export ───────────────────────────────────────────────────────────────

function buildCSV(
  s1: Scope1, s2: Scope2, s3: Scope3,
  cS1: CustomRow[], cS2: CustomRow[], cS3: CustomRow[],
  r: ReturnType<typeof calc>, estimatedBudget: number,
) {
  const q = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  const row = (...cols: unknown[]) => cols.map(q).join(",");
  const customBlock = (rows: CustomRow[]) =>
    rows.map((cr) => row(cr.label, cr.unit, cr.value, cr.factor, (cr.value * cr.factor).toFixed(2))).join("\n");

  return [
    row("Otesha Corporate Portal — Emissions Report"),
    row("Generated", new Date().toLocaleDateString("en-GB")),
    "",
    row("SCOPE 1 - Direct Emissions"),
    row("Item", "Unit", "Quantity", "Factor (kg CO2e/unit)", "kg CO2e"),
    row("Diesel", "litres", s1.diesel, FACTORS.diesel, (s1.diesel * FACTORS.diesel).toFixed(2)),
    row("Petrol", "litres", s1.petrol, FACTORS.petrol, (s1.petrol * FACTORS.petrol).toFixed(2)),
    row("Natural Gas", "m3", s1.naturalGas, FACTORS.naturalGas, (s1.naturalGas * FACTORS.naturalGas).toFixed(2)),
    row("LPG", "litres", s1.lpg, FACTORS.lpg, (s1.lpg * FACTORS.lpg).toFixed(2)),
    row("AC Refrigerant (HFC-134a)", "kg", s1.refrigerant, FACTORS.refrigerant, (s1.refrigerant * FACTORS.refrigerant).toFixed(2)),
    customBlock(cS1),
    "",
    row("SCOPE 2 - Purchased Electricity"),
    row("Item", "Unit", "Quantity", "Source", "kg CO2e"),
    row("Electricity", "kWh", s2.kwh, s2.source, (s2.kwh * FACTORS[s2.source]).toFixed(2)),
    customBlock(cS2),
    "",
    row("SCOPE 3 - Business Travel"),
    row("Item", "Unit", "Quantity", "Factor (kg CO2e/unit)", "kg CO2e"),
    row("Short-haul flights", "passenger-km", s3.flightShortKm, FACTORS.flightShort, (s3.flightShortKm * FACTORS.flightShort).toFixed(2)),
    row("Long-haul flights", "passenger-km", s3.flightLongKm, FACTORS.flightLong, (s3.flightLongKm * FACTORS.flightLong).toFixed(2)),
    row("Road travel", "km", s3.vehicleKm, FACTORS.vehicle, (s3.vehicleKm * FACTORS.vehicle).toFixed(2)),
    customBlock(cS3),
    "",
    row("RESULTS"),
    row("Scope 1 (tCO2e)", (r.scope1 / 1000).toFixed(4)),
    row("Scope 2 (tCO2e)", (r.scope2 / 1000).toFixed(4)),
    row("Scope 3 (tCO2e)", (r.scope3 / 1000).toFixed(4)),
    row("Total (tCO2e)", r.totalT.toFixed(4)),
    row("Trees needed to offset", r.treesNeeded),
    ...(estimatedBudget > 0 ? [row("Estimated budget (TZS)", estimatedBudget)] : []),
  ].join("\n");
}

// ─── CSV parser ───────────────────────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const cols: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (c === ',' && !inQ) { cols.push(cur); cur = ""; }
    else cur += c;
  }
  cols.push(cur);
  return cols.map((s) => s.trim());
}

type ParsedCSV = {
  s1: Scope1; s2: Scope2; s3: Scope3;
  cS1: CustomRow[]; cS2: CustomRow[]; cS3: CustomRow[];
};

function parseCSV(text: string): ParsedCSV {
  const s1 = { ...DEFAULT_S1 }, s2 = { ...DEFAULT_S2 }, s3 = { ...DEFAULT_S3 };
  const cS1: CustomRow[] = [], cS2: CustomRow[] = [], cS3: CustomRow[] = [];
  let section = "";

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const cols = parseCsvLine(line);
    const c0 = cols[0] || "";

    if (c0.startsWith("SCOPE 1")) { section = "s1"; continue; }
    if (c0.startsWith("SCOPE 2")) { section = "s2"; continue; }
    if (c0.startsWith("SCOPE 3")) { section = "s3"; continue; }
    if (c0 === "RESULTS" || c0 === "Item" || c0.startsWith("Otesha") || c0 === "Generated") continue;

    const qty = parseFloat(cols[2]) || 0;
    const factor = parseFloat(cols[3]) || 0;

    if (section === "s1") {
      if (c0 === "Diesel") s1.diesel = qty;
      else if (c0 === "Petrol") s1.petrol = qty;
      else if (c0 === "Natural Gas") s1.naturalGas = qty;
      else if (c0 === "LPG") s1.lpg = qty;
      else if (c0 === "AC Refrigerant (HFC-134a)") s1.refrigerant = qty;
      else if (c0) cS1.push({ id: uid(), label: c0, value: qty, unit: cols[1] || "", factor });
    } else if (section === "s2") {
      if (c0 === "Electricity") {
        s2.kwh = qty;
        const src = cols[3] as ElecSource;
        if (["grid", "hydro", "solar", "gas_gen"].includes(src)) s2.source = src;
      } else if (c0) {
        cS2.push({ id: uid(), label: c0, value: qty, unit: cols[1] || "", factor });
      }
    } else if (section === "s3") {
      if (c0 === "Short-haul flights") s3.flightShortKm = qty;
      else if (c0 === "Long-haul flights") s3.flightLongKm = qty;
      else if (c0 === "Road travel") s3.vehicleKm = qty;
      else if (c0) cS3.push({ id: uid(), label: c0, value: qty, unit: cols[1] || "", factor });
    }
  }
  return { s1, s2, s3, cS1, cS2, cS3 };
}

// ─── PDF print ────────────────────────────────────────────────────────────────

function printPDF(
  s1: Scope1, s2: Scope2, s3: Scope3,
  cS1: CustomRow[], cS2: CustomRow[], cS3: CustomRow[],
  results: ReturnType<typeof calc>,
  portfolioTrees: number, estimatedBudget: number,
) {
  const win = window.open("", "_blank");
  if (!win) { alert("Please allow pop-ups to generate the PDF."); return; }

  const r = (label: string, unit: string, qty: number, factor: number | string, kg: number) =>
    `<tr><td>${label}</td><td>${qty > 0 ? qty.toLocaleString() : "—"}</td><td>${unit}</td><td>${factor}</td><td>${kg.toFixed(1)}</td></tr>`;
  const customRows = (rows: CustomRow[]) =>
    rows.map((cr) => r(cr.label, cr.unit, cr.value, cr.factor, cr.value * cr.factor)).join("");
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Emissions Report — Otesha</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,'Times New Roman',serif;color:#1a2e1f;background:#fff;padding:40px;max-width:780px;margin:0 auto}
h1{font-size:26px;color:#1d4432;margin-bottom:4px}
.meta{color:#666;font-size:12px;font-family:Arial,sans-serif;margin-bottom:32px}
h2{font-size:11.5px;font-family:Arial,sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#5a7a69;border-bottom:1px solid #e0ebe2;padding-bottom:6px;margin:28px 0 12px}
table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:Arial,sans-serif}
th{background:#f0f6f2;text-align:left;padding:7px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#5a7a69}
td{padding:7px 10px;border-bottom:1px solid #eef2ef}
tr:last-child td{border-bottom:none}
.summary{background:#f4f9f5;border:1px solid #d8e8dc;border-radius:10px;padding:24px;margin-top:28px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:14px}
.val{font-size:22px;font-weight:700;color:#1d4432}
.lbl{font-size:10px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:#666;margin-top:3px}
.budget{margin-top:18px;padding-top:16px;border-top:1px solid #d8e8dc}
.footer{margin-top:36px;padding-top:14px;border-top:1px solid #e0ebe2;font-size:10.5px;font-family:Arial,sans-serif;color:#888;line-height:1.6}
@media print{body{padding:15mm 20mm}}
</style></head><body>
<h1>Emissions Report</h1>
<p class="meta">Generated ${date} &nbsp;·&nbsp; DEFRA 2024 methodology &nbsp;·&nbsp; tCO₂e</p>

<h2>Scope 1 — Direct Emissions</h2>
<table><thead><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Factor (kg CO₂e)</th><th>kg CO₂e</th></tr></thead><tbody>
${r("Diesel","litres",s1.diesel,FACTORS.diesel,s1.diesel*FACTORS.diesel)}
${r("Petrol","litres",s1.petrol,FACTORS.petrol,s1.petrol*FACTORS.petrol)}
${r("Natural Gas","m³",s1.naturalGas,FACTORS.naturalGas,s1.naturalGas*FACTORS.naturalGas)}
${r("LPG","litres",s1.lpg,FACTORS.lpg,s1.lpg*FACTORS.lpg)}
${r("AC Refrigerant (HFC-134a)","kg",s1.refrigerant,FACTORS.refrigerant,s1.refrigerant*FACTORS.refrigerant)}
${customRows(cS1)}</tbody></table>

<h2>Scope 2 — Purchased Electricity</h2>
<table><thead><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Source</th><th>kg CO₂e</th></tr></thead><tbody>
<tr><td>Electricity</td><td>${s2.kwh > 0 ? s2.kwh.toLocaleString() : "—"}</td><td>kWh</td><td>${s2.source}</td><td>${(s2.kwh * FACTORS[s2.source]).toFixed(1)}</td></tr>
${customRows(cS2)}</tbody></table>

<h2>Scope 3 — Business Travel</h2>
<table><thead><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Factor (kg CO₂e)</th><th>kg CO₂e</th></tr></thead><tbody>
${r("Short-haul flights","passenger-km",s3.flightShortKm,FACTORS.flightShort,s3.flightShortKm*FACTORS.flightShort)}
${r("Long-haul flights","passenger-km",s3.flightLongKm,FACTORS.flightLong,s3.flightLongKm*FACTORS.flightLong)}
${r("Road travel","km",s3.vehicleKm,FACTORS.vehicle,s3.vehicleKm*FACTORS.vehicle)}
${customRows(cS3)}</tbody></table>

<div class="summary">
  <div style="font-size:11px;font-family:Arial;text-transform:uppercase;letter-spacing:.1em;color:#5a7a69">Summary Results</div>
  <div class="grid">
    <div><div class="val">${results.totalT.toFixed(2)} t</div><div class="lbl">Total tCO₂e</div></div>
    <div><div class="val">${results.treesNeeded.toLocaleString()}</div><div class="lbl">Trees needed / yr</div></div>
    <div><div class="val">${portfolioTrees.toLocaleString()}</div><div class="lbl">Portfolio trees</div></div>
  </div>
  ${estimatedBudget > 0 ? `<div class="budget"><div style="font-size:10px;font-family:Arial;text-transform:uppercase;letter-spacing:.1em;color:#666">Estimated budget to offset</div><div style="font-size:20px;font-weight:700;color:#1d4432;margin-top:5px">${estimatedBudget.toLocaleString()} TZS</div></div>` : ""}
</div>

<div class="footer">
  Scope 1: ${(results.scope1/1000).toFixed(4)} tCO₂e &nbsp;·&nbsp;
  Scope 2: ${(results.scope2/1000).toFixed(4)} tCO₂e &nbsp;·&nbsp;
  Scope 3: ${(results.scope3/1000).toFixed(4)} tCO₂e<br>
  Methodology: DEFRA 2024 Greenhouse Gas Conversion Factors · NCAIC verified · Veritree species data
</div>
</body></html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 400);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NumInput({ label, unit, value, onChange }: {
  label: string; unit: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-ink-2">{label}</div>
        <div className="text-[11.5px] text-muted">{unit}</div>
      </div>
      <input
        type="number" min={0} value={value || ""} placeholder="0"
        onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
        className="w-28 rounded-lg border border-line bg-tile px-3 py-1.5 text-right text-[13.5px] font-semibold text-ink focus:border-green-deep focus:outline-none focus:ring-1 focus:ring-green-deep"
      />
    </div>
  );
}

function CustomRowInput({ row, onUpdate, onRemove }: {
  row: CustomRow;
  onUpdate: (id: string, field: keyof Omit<CustomRow, "id">, value: string | number) => void;
  onRemove: (id: string) => void;
}) {
  const inp = "rounded-lg border border-line bg-[#f8fbf9] px-2.5 py-1.5 text-[12.5px] text-ink focus:border-green-deep focus:outline-none focus:ring-1 focus:ring-green-deep";
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-dashed border-line py-3 last:border-b-0">
      <input
        type="text" value={row.label} placeholder="Description"
        onChange={(e) => onUpdate(row.id, "label", e.target.value)}
        className={`${inp} min-w-0 flex-1`}
      />
      <input
        type="number" min={0} value={row.value || ""} placeholder="0"
        onChange={(e) => onUpdate(row.id, "value", parseFloat(e.target.value) || 0)}
        className={`${inp} w-24 text-right`}
      />
      <input
        type="text" value={row.unit} placeholder="unit"
        onChange={(e) => onUpdate(row.id, "unit", e.target.value)}
        className={`${inp} w-16`}
      />
      <input
        type="number" min={0} step="any" value={row.factor || ""} placeholder="kg CO₂e/unit"
        onChange={(e) => onUpdate(row.id, "factor", parseFloat(e.target.value) || 0)}
        title="DEFRA kg CO₂e per unit"
        className={`${inp} w-28 text-right`}
      />
      <button
        onClick={() => onRemove(row.id)}
        className="grid h-7 w-7 flex-none place-items-center rounded-full text-muted transition-colors hover:bg-[#f3ddd6] hover:text-[#8a3320]"
      >
        <X size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
}

function ScopeCard({ scope, icon: Icon, title, subtitle, color, tCO2e, children, open, onToggle, customRows, onAddRow, onUpdateRow, onRemoveRow }: {
  scope: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string; subtitle: string; color: string; tCO2e: number;
  children: React.ReactNode; open: boolean; onToggle: () => void;
  customRows: CustomRow[];
  onAddRow: () => void;
  onUpdateRow: (id: string, field: keyof Omit<CustomRow, "id">, value: string | number) => void;
  onRemoveRow: (id: string) => void;
}) {
  return (
    <div className="rounded-(--r-lg) border border-[rgba(20,50,40,.06)] bg-card shadow-(--shadow)">
      <button onClick={onToggle} className="flex w-full items-center gap-4 p-5 text-left">
        <div className={`grid h-10 w-10 flex-none place-items-center rounded-sm ${color}`}>
          <Icon size={18} strokeWidth={1.9} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">{scope}</span>
          <div className="text-[14.5px] font-semibold text-ink">{title}</div>
          <div className="text-[12px] text-muted">{subtitle}</div>
        </div>
        <div className="flex-none text-right">
          <div className="font-serif text-[22px] font-semibold text-ink">{tCO2e.toFixed(2)}</div>
          <div className="text-[11px] text-muted">tCO₂e</div>
        </div>
        <div className="flex-none text-muted-2">
          {open ? <ChevronUp size={18} strokeWidth={2} /> : <ChevronDown size={18} strokeWidth={2} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-line px-5 pb-5 pt-1">
          {children}

          {/* Dynamic custom rows */}
          {customRows.length > 0 && (
            <div className="mt-3 border-t border-dashed border-line pt-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted">Custom entries</span>
                <span className="text-[10px] text-muted-2">label · quantity · unit · kg CO₂e per unit</span>
              </div>
              {customRows.map((row) => (
                <CustomRowInput key={row.id} row={row} onUpdate={onUpdateRow} onRemove={onRemoveRow} />
              ))}
            </div>
          )}

          <button
            onClick={onAddRow}
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-[oklch(0.55_0.13_150)/40] px-3 py-1.5 text-[12.5px] font-semibold text-green-deep transition-colors hover:bg-[#eaf4ec] hover:border-[oklch(0.55_0.13_150)/70]"
          >
            <Plus size={13} strokeWidth={2.5} /> Add custom entry
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function EmissionsScreen({ role, go }: { role: Role; go: (next: Partial<Route>) => void }) {
  const { portfolio } = usePortal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [s1, setS1] = useState<Scope1>(DEFAULT_S1);
  const [s2, setS2] = useState<Scope2>(DEFAULT_S2);
  const [s3, setS3] = useState<Scope3>(DEFAULT_S3);
  const [cS1, setCS1] = useState<CustomRow[]>([]);
  const [cS2, setCS2] = useState<CustomRow[]>([]);
  const [cS3, setCS3] = useState<CustomRow[]>([]);
  const [open, setOpen] = useState<1 | 2 | 3 | null>(1);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  const results = useMemo(() => calc(s1, s2, s3, cS1, cS2, cS3), [s1, s2, s3, cS1, cS2, cS3]);
  const { scope1, scope2, scope3, totalKg, totalT, treesNeeded } = results;

  useEffect(() => {
    if (totalKg === 0) return;
    try {
      localStorage.setItem("otesha_emission_snapshot", JSON.stringify({
        totalT,
        treesNeeded,
        scope1T: scope1 / 1000,
        scope2T: scope2 / 1000,
        scope3T: scope3 / 1000,
        savedAt: new Date().toISOString(),
      }));
    } catch {
      // ignore storage errors
    }
  }, [totalT, treesNeeded, scope1, scope2, scope3, totalKg]);

  const portfolioOffset = +(portfolio.trees * KG_PER_TREE_PER_YEAR / 1000).toFixed(2);
  const netBalance = +(portfolioOffset - totalT).toFixed(2);
  const covered = totalT === 0 ? 100 : Math.min(100, Math.round((portfolioOffset / totalT) * 100));
  const surplus = netBalance >= 0;
  const barMax = Math.max(scope1, scope2, scope3, 1);

  const costPerTree =
    portfolio.trees > 0 && portfolio.investedTZS > 0
      ? Math.round(portfolio.investedTZS / portfolio.trees)
      : 50_000;
  const estimatedBudget = treesNeeded * costPerTree;
  const fmtBudget = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${Math.round(n / 1_000)}K` : n.toLocaleString();

  // ── custom row helpers ──
  const makeRowOps = (
    rows: CustomRow[],
    set: React.Dispatch<React.SetStateAction<CustomRow[]>>,
  ) => ({
    onAddRow: () => set((r) => [...r, { id: uid(), label: "", value: 0, unit: "", factor: 0 }]),
    onUpdateRow: (id: string, field: keyof Omit<CustomRow, "id">, value: string | number) =>
      set((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row))),
    onRemoveRow: (id: string) => set((r) => r.filter((row) => row.id !== id)),
  });

  const s1Ops = makeRowOps(cS1, setCS1);
  const s2Ops = makeRowOps(cS2, setCS2);
  const s3Ops = makeRowOps(cS3, setCS3);

  // ── download CSV ──
  function downloadCSV() {
    const csv = buildCSV(s1, s2, s3, cS1, cS2, cS3, results, estimatedBudget);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `otesha-emissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── upload CSV ──
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target?.result as string);
        setS1(parsed.s1); setS2(parsed.s2); setS3(parsed.s3);
        setCS1(parsed.cS1); setCS2(parsed.cS2); setCS3(parsed.cS3);
        setUploadMsg(`Loaded from ${file.name}`);
        setTimeout(() => setUploadMsg(null), 4000);
      } catch {
        setUploadMsg("Could not parse file — use the CSV format from Download.");
        setTimeout(() => setUploadMsg(null), 5000);
      }
    };
    reader.readAsText(file);
  }

  const elecSources: { value: ElecSource; label: string }[] = [
    { value: "grid", label: "National grid" },
    { value: "hydro", label: "Hydroelectric" },
    { value: "solar", label: "Solar / wind" },
    { value: "gas_gen", label: "Gas generator" },
  ];

  return (
    <div className="mx-auto max-w-295">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(20,50,40,.08)] bg-card px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-warn-ink" />
            Carbon tracker
          </div>
          <h1 className="mt-2 font-serif text-[26px] font-semibold leading-[1.05] tracking-[-0.015em] text-ink md:text-[30px]">
            Emissions Calculator
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Enter your usage data to calculate tCO₂e and see how your tree portfolio offsets it.
          </p>
        </div>
        <RoleToggle role={role} setRole={(r) => go({ screen: "emissions", role: r })} />
      </div>

      {/* Action toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 py-2 text-[12.5px] font-semibold text-ink-2 shadow-sm transition-all hover:border-[rgba(20,50,40,.2)] hover:bg-tile"
        >
          <Upload size={14} strokeWidth={2} /> Upload CSV
        </button>
        <button
          onClick={downloadCSV}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 py-2 text-[12.5px] font-semibold text-ink-2 shadow-sm transition-all hover:border-[rgba(20,50,40,.2)] hover:bg-tile"
        >
          <FileSpreadsheet size={14} strokeWidth={2} /> Download CSV
        </button>
        <button
          onClick={() => printPDF(s1, s2, s3, cS1, cS2, cS3, results, portfolio.trees, estimatedBudget)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3.5 py-2 text-[12.5px] font-semibold text-ink-2 shadow-sm transition-all hover:border-[rgba(20,50,40,.2)] hover:bg-tile"
        >
          <Printer size={14} strokeWidth={2} /> Print / PDF
        </button>
        {uploadMsg && (
          <span className="flex items-center gap-1.5 text-[12px] text-ok-ink">
            <Check size={13} strokeWidth={2.5} /> {uploadMsg}
          </span>
        )}
      </div>

      {/* Summary KPIs — 5 boxes */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
        {[
          {
            label: "Total emissions",
            value: totalT.toFixed(2),
            unit: "tCO₂e",
            note: `${Math.round(totalKg).toLocaleString()} kg CO₂e`,
          },
          {
            label: "Trees needed",
            value: treesNeeded.toLocaleString(),
            unit: "trees / yr",
            note: "to fully offset",
          },
          {
            label: "Portfolio offset",
            value: portfolioOffset.toFixed(1),
            unit: "tCO₂e / yr",
            note: `${portfolio.trees.toLocaleString()} trees`,
          },
          {
            label: surplus ? "Surplus offset" : "Offset gap",
            value: Math.abs(netBalance).toFixed(2),
            unit: "tCO₂e",
            note: surplus ? "carbon positive" : "gap to close",
            colored: true,
            positive: surplus,
          },
          {
            label: "Estimated budget",
            value: treesNeeded > 0 ? fmtBudget(estimatedBudget) : "—",
            unit: "TZS",
            note: treesNeeded > 0 ? `~${costPerTree.toLocaleString()} TZS / tree` : "enter data above",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="relative overflow-hidden rounded-(--r-lg) border border-[rgba(20,50,40,.06)] bg-card p-5 shadow-(--shadow)"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[oklch(0.55_0.13_150)]/40 to-transparent" />
            <div className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.09em] text-muted">{k.label}</div>
            <div
              className={`font-serif text-[26px] font-semibold leading-none tracking-[-0.015em] ${
                "colored" in k && k.colored
                  ? k.positive ? "text-ok-ink" : "text-[#8a3320]"
                  : "text-ink"
              }`}
            >
              {k.value}
              <small className="ml-1 font-sans text-[11px] font-semibold text-muted">{k.unit}</small>
            </div>
            <div className="mt-1.5 text-[11.5px] text-muted">{k.note}</div>
          </div>
        ))}
      </div>

      {/* Scope input cards */}
      <SectionTitle>Enter your usage data</SectionTitle>

      <div className="flex flex-col gap-4">
        <ScopeCard
          scope="Scope 1 — Direct" icon={Flame} title="Fuel & refrigerants"
          subtitle="Diesel, petrol, natural gas, LPG, AC refrigerant"
          color="bg-[#fef0e6] text-[#c2520a]" tCO2e={scope1 / 1000}
          open={open === 1} onToggle={() => setOpen(open === 1 ? null : 1)}
          customRows={cS1} {...s1Ops}
        >
          <NumInput label="Diesel" unit="litres" value={s1.diesel} onChange={(v) => setS1({ ...s1, diesel: v })} />
          <NumInput label="Petrol / gasoline" unit="litres" value={s1.petrol} onChange={(v) => setS1({ ...s1, petrol: v })} />
          <NumInput label="Natural gas" unit="m³" value={s1.naturalGas} onChange={(v) => setS1({ ...s1, naturalGas: v })} />
          <NumInput label="LPG" unit="litres" value={s1.lpg} onChange={(v) => setS1({ ...s1, lpg: v })} />
          <NumInput label="AC refrigerant (HFC-134a)" unit="kg leaked" value={s1.refrigerant} onChange={(v) => setS1({ ...s1, refrigerant: v })} />
          <p className="mt-3 text-[11.5px] text-muted">
            Factors: diesel 2.68 · petrol 2.31 · gas 2.02 · LPG 1.56 · HFC-134a 1,430 kg CO₂e per unit — DEFRA 2024
          </p>
        </ScopeCard>

        <ScopeCard
          scope="Scope 2 — Purchased" icon={Zap} title="Electricity"
          subtitle="Grid, hydro, solar, gas generator"
          color="bg-[#e8f0fc] text-[#2c4d75]" tCO2e={scope2 / 1000}
          open={open === 2} onToggle={() => setOpen(open === 2 ? null : 2)}
          customRows={cS2} {...s2Ops}
        >
          <NumInput label="Electricity consumed" unit="kWh" value={s2.kwh} onChange={(v) => setS2({ ...s2, kwh: v })} />
          <div className="pb-3 pt-4">
            <div className="mb-2 text-[12px] font-semibold text-ink-2">Energy source</div>
            <div className="flex flex-wrap gap-2">
              {elecSources.map((src) => (
                <button
                  key={src.value}
                  onClick={() => setS2({ ...s2, source: src.value })}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all ${
                    s2.source === src.value
                      ? "bg-ink text-[#eaf3ec] shadow-sm"
                      : "border border-line bg-tile text-muted hover:border-[rgba(20,50,40,.2)] hover:text-ink"
                  }`}
                >
                  {s2.source === src.value && <Check size={12} strokeWidth={2.5} />}
                  {src.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1 text-[11.5px] text-muted">
            Factors: grid 0.21 · hydro 0.02 · solar 0.05 · gas gen 0.49 kg CO₂e / kWh — DEFRA 2024
          </p>
        </ScopeCard>

        <ScopeCard
          scope="Scope 3 — Financed" icon={Plane} title="Business travel"
          subtitle="Air travel (mandatory from 2023) and road transport"
          color="bg-[#f0eafa] text-[#5b3a8a]" tCO2e={scope3 / 1000}
          open={open === 3} onToggle={() => setOpen(open === 3 ? null : 3)}
          customRows={cS3} {...s3Ops}
        >
          <NumInput label="Short-haul flights" unit="total passenger-km (< 3,700 km)" value={s3.flightShortKm} onChange={(v) => setS3({ ...s3, flightShortKm: v })} />
          <NumInput label="Long-haul flights" unit="total passenger-km (≥ 3,700 km)" value={s3.flightLongKm} onChange={(v) => setS3({ ...s3, flightLongKm: v })} />
          <NumInput label="Road travel" unit="km (company vehicles)" value={s3.vehicleKm} onChange={(v) => setS3({ ...s3, vehicleKm: v })} />
          <p className="mt-3 text-[11.5px] text-muted">
            Factors: short-haul 0.255 · long-haul 0.195 · road 0.17 kg CO₂e per passenger-km — DEFRA 2024
          </p>
        </ScopeCard>
      </div>

      {/* Results */}
      <SectionTitle>Offset analysis</SectionTitle>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-(--r-lg) border border-[rgba(20,50,40,.06)] bg-card shadow-(--shadow)">
          <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-2">Scope breakdown</h3>
            <span className="font-serif text-[15px] font-semibold text-ink">{totalT.toFixed(2)} tCO₂e total</span>
          </div>
          <div className="space-y-4 p-6">
            {[
              { label: "Scope 1 — Direct", kg: scope1, color: "bg-[#f97316]", icon: Flame },
              { label: "Scope 2 — Purchased electricity", kg: scope2, color: "bg-[#3b82f6]", icon: Zap },
              { label: "Scope 3 — Business travel", kg: scope3, color: "bg-[#8b5cf6]", icon: Car },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 font-medium text-ink-2">
                    <row.icon size={13} strokeWidth={1.9} className="text-muted" />
                    {row.label}
                  </span>
                  <span className="tabular-nums text-muted">{(row.kg / 1000).toFixed(3)} t</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-tile">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                    style={{ width: `${Math.round((row.kg / barMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {totalT === 0 && (
              <p className="pt-2 text-center text-[12.5px] text-muted">Enter usage data above to see your breakdown.</p>
            )}
          </div>
        </div>

        <div className="rounded-(--r-lg) border border-[rgba(20,50,40,.06)] bg-card shadow-(--shadow)">
          <div className="flex items-center justify-between border-b border-line bg-[rgba(20,50,40,.012)] px-6 py-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink-2">Portfolio offset</h3>
            <span className={`text-[12.5px] font-semibold ${surplus ? "text-ok-ink" : "text-[#8a3320]"}`}>
              {surplus ? "Carbon positive" : "Offset gap"}
            </span>
          </div>
          <div className="p-6">
            <div className="mb-5 flex items-center gap-5">
              <div className="relative grid h-18 w-18 flex-none place-items-center">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--tile)" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none"
                    stroke={surplus ? "var(--color-ok-ink)" : "#8a3320"}
                    strokeWidth="4"
                    strokeDasharray={`${(covered / 100) * 87.96} 87.96`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[13px] font-bold text-ink">{covered}%</span>
              </div>
              <div>
                <div className="text-[13px] font-semibold text-ink">{covered}% of emissions covered</div>
                <div className="mt-0.5 text-[12px] text-muted">by your {portfolio.trees.toLocaleString()} planted trees</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-(--r-md) bg-tile px-4 py-3">
                <span className="flex items-center gap-2 text-[12.5px] text-muted">
                  <TreePine size={14} strokeWidth={1.8} /> Trees in portfolio
                </span>
                <span className="font-semibold text-ink">{portfolio.trees.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between rounded-(--r-md) bg-tile px-4 py-3">
                <span className="flex items-center gap-2 text-[12.5px] text-muted">
                  <Calculator size={14} strokeWidth={1.8} /> Trees needed to offset
                </span>
                <span className="font-semibold text-ink">{treesNeeded.toLocaleString()}</span>
              </div>
              {treesNeeded > 0 && (
                <div className="flex items-center justify-between rounded-(--r-md) bg-tile px-4 py-3">
                  <span className="flex items-center gap-2 text-[12.5px] text-muted">
                    <FileDown size={14} strokeWidth={1.8} /> Estimated offset cost
                  </span>
                  <span className="font-semibold text-ink">{estimatedBudget.toLocaleString()} TZS</span>
                </div>
              )}
              <div className={`flex items-center justify-between rounded-(--r-md) px-4 py-3 ${surplus ? "bg-ok-bg" : "bg-[#f3ddd6]"}`}>
                <span className={`flex items-center gap-2 text-[12.5px] font-semibold ${surplus ? "text-ok-ink" : "text-[#8a3320]"}`}>
                  {surplus ? <Check size={14} strokeWidth={2.2} /> : <TreePine size={14} strokeWidth={1.8} />}
                  {surplus ? "Surplus trees" : "Additional trees needed"}
                </span>
                <span className={`font-bold ${surplus ? "text-ok-ink" : "text-[#8a3320]"}`}>
                  {surplus
                    ? `+${(portfolio.trees - treesNeeded).toLocaleString()}`
                    : (treesNeeded - portfolio.trees).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="mt-4 text-[11.5px] leading-relaxed text-muted">
              Based on {KG_PER_TREE_PER_YEAR} kg CO₂ absorbed per tree per year (human-planted average).
              Budget estimate uses your portfolio&apos;s cost-per-tree ratio.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-(--r-lg) border border-[rgba(20,50,40,.06)] bg-card px-6 py-4 shadow-(--shadow)">
        <div className="text-[12.5px] text-muted">
          <span className="mr-1 font-semibold text-ink-2">Methodology:</span>
          DEFRA 2024 greenhouse gas conversion factors · tCO₂e · NCAIC verified · Veritree species data
        </div>
        <a
          href="https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-green-deep hover:text-ink"
        >
          DEFRA factors <ExternalLink size={12} strokeWidth={2} />
        </a>
      </div>

      <div className="h-7.5" />
    </div>
  );
}
