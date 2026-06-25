import type { Report, Project } from "./types";
import { BRAND_NAME, BRAND_PORTAL_LABEL } from "./brand";

export function printReportPDF(report: Report, project: Project) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow pop-ups to generate the PDF.");
    return;
  }

  const tg = report.trigger;
  const up = tg.dir === "up";
  const co2Add = Math.round(project.co2 * (tg.delta / 100) * 4) || 18;
  const survPct = Math.round(project.survival * 100);
  const verifiedFmt = project.verifiedTZS >= 1_000_000
    ? `${(project.verifiedTZS / 1_000_000).toFixed(1)}M TZS`
    : `${Math.round(project.verifiedTZS / 1_000)}K TZS`;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });

  win.document.write(`<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>${report.title} — ${BRAND_NAME} Report</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,'Times New Roman',serif;color:#1a2e1f;background:#fff;padding:40px;max-width:760px;margin:0 auto}
.header{border-bottom:2px solid #1d4432;padding-bottom:16px;margin-bottom:28px}
.brand{font-size:11px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:.15em;color:#5a7a69;margin-bottom:8px}
h1{font-size:24px;color:#1d4432;margin-bottom:6px;line-height:1.2}
.meta{color:#666;font-size:12px;font-family:Arial,sans-serif}
.headline{padding:14px 18px;border-radius:8px;font-size:15px;line-height:1.5;margin:22px 0;font-family:Georgia,serif}
.headline.up{background:#eaf4ec;border-left:4px solid #2d7a4a;color:#1d4432}
.headline.down{background:#f8e9e4;border-left:4px solid #a03020;color:#6b2010}
h2{font-size:11px;font-family:Arial,sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#5a7a69;border-bottom:1px solid #e0ebe2;padding-bottom:5px;margin:24px 0 14px}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.metric{background:#f4f9f5;border-radius:8px;padding:12px;text-align:center}
.metric-val{font-size:20px;font-weight:700;color:#1d4432}
.metric-lbl{font-size:10px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#666;margin-top:3px}
.narrative{font-size:14px;line-height:1.65;color:#2a3e30;margin-bottom:20px}
.narrative b{color:#1d4432}
.sites{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:12px}
.site{background:#f4f9f5;border-radius:6px;padding:8px 12px;font-size:12.5px;font-family:Arial,sans-serif;display:flex;justify-content:space-between}
.carbon{background:#f4f9f5;border:1px solid #d8e8dc;border-radius:10px;padding:20px;margin-bottom:20px}
.carbon-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:12px}
.carbon-val{font-size:18px;font-weight:700;color:#1d4432}
.carbon-lbl{font-size:10px;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#666;margin-top:3px}
.footer{margin-top:32px;padding-top:12px;border-top:1px solid #e0ebe2;font-size:10.5px;font-family:Arial,sans-serif;color:#888;line-height:1.6}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-family:Arial,sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.badge-new{background:#e8f0fb;color:#2c4d75}
.badge-reviewed{background:#eaf4ec;color:#1d5c30}
@media print{body{padding:15mm 20mm}}
</style></head><body>

<div class="header">
  <div class="brand">${BRAND_PORTAL_LABEL} &nbsp;·&nbsp; Satellite Monitoring Report</div>
  <h1>${report.title}</h1>
  <div class="meta">
    ${project.name} &nbsp;·&nbsp; ${project.region}
    &nbsp;·&nbsp; ${report.generated.split(" · ")[0]}
    &nbsp;·&nbsp; <span class="badge ${report.status === "new" ? "badge-new" : "badge-reviewed"}">${report.status}</span>
  </div>
</div>

<div class="headline ${up ? "up" : "down"}">${report.headline}</div>

<h2>Key metrics</h2>
<div class="metrics">
  <div class="metric">
    <div class="metric-val">${up ? "+" : ""}${tg.delta}%</div>
    <div class="metric-lbl">Tree cover change</div>
  </div>
  <div class="metric">
    <div class="metric-val">${project.trees.toLocaleString()}</div>
    <div class="metric-lbl">Trees planted</div>
  </div>
  <div class="metric">
    <div class="metric-val">${project.co2.toLocaleString()} t</div>
    <div class="metric-lbl">CO₂ stored</div>
  </div>
  <div class="metric">
    <div class="metric-val">${verifiedFmt}</div>
    <div class="metric-lbl">Verified value</div>
  </div>
</div>

<h2>Carbon impact</h2>
<div class="carbon">
  <div class="carbon-grid">
    <div>
      <div class="carbon-val">${project.co2.toLocaleString()} t</div>
      <div class="carbon-lbl">CO₂ sequestered (lifetime)</div>
    </div>
    <div>
      <div class="carbon-val">${up ? "+" : ""}${co2Add} t</div>
      <div class="carbon-lbl">This update</div>
    </div>
    <div>
      <div class="carbon-val">${survPct}%</div>
      <div class="carbon-lbl">Survival rate</div>
    </div>
  </div>
</div>

<h2>Satellite observation</h2>
<p class="narrative">
  Image saved on <b>${tg.pass}</b> from <b>${tg.sensor}</b> (tile ${tg.tile}, ${tg.cloud}% cloud cover).
  NDVI moved from <b>${tg.ndviBefore.toFixed(2)}</b> to <b>${tg.ndviAfter.toFixed(2)}</b>
  — confidence <b>${Math.round(tg.confidence * 100)}%</b>.
  Tree cover across ${project.short}'s ${project.sites.length} site${project.sites.length !== 1 ? "s" : ""}
  is ${up ? "up" : "down"} <b>${up ? "+" : ""}${tg.delta}%</b> since the last check.
</p>

${project.sites.length > 0 ? `
<h2>Site breakdown</h2>
<div class="sites">
  ${project.sites.slice(0, 8).map(s =>
    `<div class="site"><span>${s.name}</span><span>${s.trees.toLocaleString()} trees · ${Math.round(s.surv * 100)}%</span></div>`
  ).join("")}
</div>` : ""}

<div class="footer">
  Project: ${project.name} &nbsp;·&nbsp; Region: ${project.region} &nbsp;·&nbsp;
  Locations: ${project.locations} &nbsp;·&nbsp; Species: ${project.species}<br>
  Methodology: DEFRA 2024 · NCAIC verified · Veritree species data · Sentinel-2 L2A imagery<br>
  Generated ${date} via ${BRAND_PORTAL_LABEL}
</div>

</body></html>`);

  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 400);
}
