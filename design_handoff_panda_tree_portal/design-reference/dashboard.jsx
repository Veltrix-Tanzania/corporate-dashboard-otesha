/* ============================================================
   Screen · Dashboard (role-aware) + date-filtered impact
   Exposed on window: DashboardScreen
   ============================================================ */

const compactTZS = (n) =>
  n >= 1e9 ? "TZS " + (n / 1e9).toFixed(2) + "B"
  : n >= 1e6 ? "TZS " + (n / 1e6).toFixed(1) + "M"
  : "TZS " + Math.round(n).toLocaleString();
const compactUSD = (n) =>
  n >= 1e6 ? "$" + (n / 1e6).toFixed(2) + "M"
  : n >= 1e3 ? "$" + Math.round(n / 1e3) + "K"
  : "$" + Math.round(n);

const RANGES = [
  { key: "3m", label: "Last 3 months", months: 3 },
  { key: "6m", label: "Last 6 months", months: 6 },
  { key: "12m", label: "Last 12 months", months: 12 },
  { key: "all", label: "All time", months: 23 },
];
const METRICS = [
  { key: "co2", label: "CO₂ stored", unit: " t", color: "oklch(0.5 0.12 150)", word: "tonnes captured" },
  { key: "trees", label: "Trees planted", unit: "", color: "oklch(0.55 0.11 150)", word: "trees in the ground" },
  { key: "canopy", label: "Tree cover gain", unit: " pts", color: "oklch(0.58 0.10 205)", word: "points of cover" },
  { key: "verified", label: "Verified value", unit: "", color: "oklch(0.66 0.11 80)", word: "of verified impact" },
];

/* ---- Date range dropdown ---- */
function DateRange({ value, setValue }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const cur = RANGES.find((r) => r.key === value) || RANGES[1];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen((o) => !o)}>
        <Icon name="calendar" size={15} stroke={1.9} /> {cur.label}
        <Icon name="chevD" size={14} stroke={2} style={{ marginLeft: 2, color: "var(--muted)" }} />
      </button>
      {open && (
        <div className="card" style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 30, minWidth: 180, padding: 6, boxShadow: "var(--shadow-lg)" }}>
          {RANGES.map((r) => (
            <button key={r.key} onClick={() => { setValue(r.key); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", border: 0,
                background: r.key === value ? "var(--tile)" : "transparent", color: "var(--ink-2)",
                fontSize: 13, fontWeight: 600, padding: "9px 12px", borderRadius: 8 }}>
              {r.key === value ? <Icon name="check" size={14} stroke={2.4} style={{ color: "var(--green-deep)" }} /> : <span style={{ width: 14 }} />}
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* slice helpers */
function sliceMetric(M, key, months) {
  const n = M.labels.length;
  const start = Math.max(0, n - 1 - months);
  const series = M[key].slice(start);
  const rawLabels = M.labels.slice(start);
  const step = Math.ceil(rawLabels.length / 6);
  const labels = rawLabels.map((l, i) => (i % step === 0 || i === rawLabels.length - 1 ? l : ""));
  const impact = M[key][n - 1] - M[key][start];
  const pct = M[key][start] ? Math.round((impact / M[key][start]) * 100) : 100;
  return { series, labels, impact, pct, start, last: M[key][n - 1] };
}

/* ---- Impact-over-time card (the date-filtered view) ---- */
function ImpactOverTime({ months, rangeKey, setRange }) {
  const D = window.APP_DATA;
  const [metric, setMetric] = React.useState("co2");
  const m = METRICS.find((x) => x.key === metric);
  const s = sliceMetric(D.monthly, metric, months);
  const period = RANGES.find((r) => r.key === rangeKey).label.toLowerCase();
  const periodPhrase = rangeKey === "all" ? "so far" : "in the " + period;
  const fmt = (v) => metric === "verified" ? compactTZS(v) : metric === "canopy" ? "+" + s.impact.toFixed(1) : Math.round(v).toLocaleString();
  const big = metric === "verified" ? compactTZS(s.impact) : metric === "canopy" ? "+" + s.impact.toFixed(1) : "+" + Math.round(s.impact).toLocaleString();

  return (
    <div className="card">
      <div className="card-head" style={{ flexWrap: "wrap", gap: 12 }}>
        <div className="flex gap8" style={{ flexWrap: "wrap" }}>
          {METRICS.map((x) => (
            <button key={x.key} onClick={() => setMetric(x.key)}
              style={{ border: "1px solid", borderColor: metric === x.key ? "transparent" : "var(--line)",
                background: metric === x.key ? "var(--ink)" : "var(--card)",
                color: metric === x.key ? "#eaf3ec" : "var(--muted)",
                fontSize: 12.5, fontWeight: 600, padding: "7px 13px", borderRadius: 999 }}>
              {x.label}
            </button>
          ))}
        </div>
        <DateRange value={rangeKey} setValue={setRange} />
      </div>
      <div className="card-pad">
        <div className="flex between center" style={{ flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
          <div>
            <div className="kpi-val" style={{ fontSize: 34, color: m.color.replace("oklch", "oklch") }}>
              {big}{m.unit}
            </div>
            <div className="small muted" style={{ marginTop: 4 }}>
              {m.word} {periodPhrase}
              {metric !== "canopy" && <span className="delta up" style={{ marginLeft: 8 }}>+{s.pct}%</span>}
            </div>
          </div>
          <div className="small muted" style={{ textAlign: "right" }}>
            <div>Running total</div>
            <div className="strong" style={{ color: "var(--ink)", fontSize: 15 }}>
              {metric === "verified" ? compactTZS(s.last) : metric === "canopy" ? "+" + s.last.toFixed(1) + " pts" : Math.round(s.last).toLocaleString() + m.unit}
            </div>
          </div>
        </div>
        <AreaTrend series={s.series} labels={s.labels} color={m.color} fill={m.color} height={230} />
      </div>
    </div>
  );
}

function DashboardScreen({ role, go }) {
  const D = window.APP_DATA;
  const P = D.portfolio;
  const allSites = D.projects.flatMap((p) => p.sites.map((s) => ({ ...s, project: p.short })));
  const [hover, setHover] = React.useState(null);
  const [rangeKey, setRangeKey] = React.useState("6m");
  const months = RANGES.find((r) => r.key === rangeKey).months;
  const periodWord = RANGES.find((r) => r.key === rangeKey).label.toLowerCase();
  const periodPhrase = rangeKey === "all" ? "so far" : "in the " + periodWord;

  const verifiedUSD = D.usd(P.verifiedTZS);
  const roi = Math.round((P.verifiedTZS / P.investedTZS - 1) * 100);

  // period-aware deltas straight off the monthly series
  const dTrees = sliceMetric(D.monthly, "trees", months).impact;
  const dCo2 = sliceMetric(D.monthly, "co2", months);
  const dCanopy = sliceMetric(D.monthly, "canopy", months).impact;
  const dVer = sliceMetric(D.monthly, "verified", months);

  const compareData = D.projects.map((p) => ({ label: p.short.split(" ")[0], a: p.budgetTZS, b: p.verifiedTZS }));
  const treesData = D.projects.map((p) => ({ label: p.short.split(" ")[0], trees: p.trees, surv: p.survival }));

  const exec = role === "exec";

  return (
    <div className="main-inner">
      {/* Header */}
      <div className="page-head">
        <div>
          <div className="eyebrow">Sustainability portfolio</div>
          <h1 style={{ marginTop: 6 }}>{D.company.account}</h1>
          <p className="sub">Here's how all of CRDB's tree-planting work is doing right now.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <RoleToggle role={role} setRole={(r) => go({ screen: "dashboard", role: r })} />
          <div style={{ marginTop: 12, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <DateRange value={rangeKey} setValue={setRangeKey} />
            <button className="btn btn-primary btn-sm" onClick={() => go({ screen: "reports" })}>
              <Icon name="download" size={15} stroke={1.9} /> {exec ? "Get the brief" : "Export data"}
            </button>
          </div>
        </div>
      </div>

      {/* Satellite alert */}
      <AlertBanner alert={D.alerts[0]} onView={() => go({ screen: "report", id: D.alerts[0].reportId, role })} />

      {/* KPI row — deltas reflect the selected date range */}
      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 16 }}>
        <KPI icon="layers" label="Active projects" value={P.activeProjects}
          sub={P.locations + " planting sites"} delta="+1" deltaDir="up" />
        <KPI icon="tree" label="Trees planted" value={(P.trees / 1000).toFixed(1)} unit="k"
          sub={Math.round(P.survival * 100) + "% still alive"} delta={"+" + (dTrees / 1000).toFixed(1) + "k"} deltaDir="up"
          spark={D.monthly.trees.slice(-6)} sparkColor="oklch(0.55 0.11 150)" />
        <KPI icon="co2" label="CO₂ stored" value={P.co2.toLocaleString()} unit=" t"
          sub={periodPhrase} delta={"+" + dCo2.pct + "%"} deltaDir="up"
          spark={D.monthly.co2.slice(-6)} sparkColor="oklch(0.5 0.12 150)" />
        <KPI icon="trend" label="Verified value" value={compactTZS(P.verifiedTZS)}
          sub={compactUSD(verifiedUSD) + " · " + roi + "% above what we spent"} delta={"+" + dVer.pct + "%"} deltaDir="up" />
      </div>

      {/* Impact over time — the date filter front and centre */}
      <SectionTitle>Impact over time</SectionTitle>
      <ImpactOverTime months={months} rangeKey={rangeKey} setRange={setRangeKey} />

      {exec ? (
        /* ===================== DECISION-MAKER VIEW ===================== */
        <>
          <SectionTitle>The short version</SectionTitle>
          <div className="card card-pad fade-in">
            <div className="flex gap24" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 420px", minWidth: 320 }}>
                <p style={{ fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.55, color: "var(--ink)", textWrap: "pretty" }}>
                  CRDB has four projects running. So far they've put <b>128,400 trees</b> in the ground,
                  <b> 87%</b> of which are still alive, and stored roughly <b>2,340 tonnes of CO₂</b>.
                  Satellite checks show tree cover is up <b>11.6%</b> since each project started, and the
                  verified value of that work now sits about <b>{roi}%</b> above what's been spent.
                </p>
                <div className="flex gap12 mt20" style={{ flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={() => go({ screen: "report", id: "RPT-2026-0142", role })}>
                    <Icon name="download" size={16} stroke={1.9} /> Download the one-pager (PDF)
                  </button>
                  <button className="btn btn-ghost" onClick={() => go({ screen: "reports" })}>
                    <Icon name="reports" size={16} stroke={1.9} /> See all reports
                  </button>
                </div>
              </div>
              <div style={{ flex: "0 0 auto", display: "flex", gap: 16 }}>
                <div className="mtile" style={{ textAlign: "center", minWidth: 130 }}>
                  <DonutStat value={P.survival} sub="alive" />
                  <div className="small muted mt6">Trees still alive</div>
                </div>
                <div className="mtile" style={{ textAlign: "center", minWidth: 130 }}>
                  <DonutStat value={0.94} color="oklch(0.62 0.11 80)" sub="sure" />
                  <div className="small muted mt6">How sure the checks are</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap20" style={{ gridTemplateColumns: "1.3fr 1fr", marginTop: 20 }}>
            <div className="card">
              <div className="card-head">
                <h3>What we spent vs what it's worth</h3>
                <span className="ch-sub">{roi}% ahead</span>
              </div>
              <div className="card-pad">
                <BarCompareChart data={compareData} />
                <div className="flex gap20 mt12" style={{ justifyContent: "center" }}>
                  <span className="flex center gap8 small muted"><span style={{ width: 12, height: 12, borderRadius: 3, background: "oklch(0.62 0.07 152)" }} /> Spent</span>
                  <span className="flex center gap8 small muted"><span style={{ width: 12, height: 12, borderRadius: 3, background: "oklch(0.5 0.12 150)" }} /> Verified worth</span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-head"><h3>Where the work is happening</h3></div>
              <div className="card-pad">
                <SiteMap sites={allSites} height={300} activeName={hover && hover.name} onHover={setHover} />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ===================== SUSTAINABILITY-MANAGER VIEW ===================== */
        <>
          <SectionTitle action={<button className="btn-quiet" onClick={() => go({ screen: "reports" })}>All reports <Icon name="chevR" size={14} stroke={2.2} /></button>}>
            How the projects are doing
          </SectionTitle>
          <div className="grid gap20" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="card">
              <div className="card-head">
                <h3>Trees planted and how many survived</h3>
                <span className="ch-sub">by project</span>
              </div>
              <div className="card-pad">
                <TreesSurvivalChart data={treesData} />
                <div className="flex gap20 mt12" style={{ justifyContent: "center" }}>
                  <span className="flex center gap8 small muted"><span style={{ width: 12, height: 12, borderRadius: 3, background: "oklch(0.74 0.05 152)" }} /> Trees planted</span>
                  <span className="flex center gap8 small muted"><span style={{ width: 14, height: 3, borderRadius: 3, background: "oklch(0.66 0.12 78)" }} /> Still alive %</span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-head">
                <h3>Tree cover gain</h3>
                <span className="ch-sub">+{P.canopyDelta}% so far</span>
              </div>
              <div className="card-pad">
                <AreaTrend series={P.canopyTrend} labels={P.quarters} suffix="%" height={230}
                  color="oklch(0.5 0.12 150)" fill="oklch(0.5 0.12 150)" />
                <div className="small muted mt12" style={{ textAlign: "center" }}>How much more tree cover there is since each project started</div>
              </div>
            </div>
          </div>

          <div className="grid gap20" style={{ gridTemplateColumns: "1.25fr 1fr", marginTop: 20 }}>
            <div className="card">
              <div className="card-head">
                <h3>Planting sites</h3>
                <span className="ch-sub">{allSites.length} sites · {P.locations} locations</span>
              </div>
              <div className="card-pad">
                <SiteMap sites={allSites} height={320} activeName={hover && hover.name} onHover={setHover} />
              </div>
            </div>
            <div className="card">
              <div className="card-head">
                <h3>Latest satellite updates</h3>
                <span className="ch-sub">saved snapshots</span>
              </div>
              <div>
                {D.reports.slice(0, 4).map((r) => {
                  const p = D.projectById(r.projectId);
                  const up = r.trigger.dir === "up";
                  return (
                    <div key={r.id} className="row click" onClick={() => go({ screen: "report", id: r.id, role })}>
                      <div className="r-ico" style={{ background: up ? "var(--ok-bg)" : "#f3ddd6", color: up ? "var(--ok-ink)" : "#8a3320" }}>
                        <Icon name={up ? "trend" : "alert"} size={18} stroke={1.9} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="flex center gap8">
                          <b style={{ fontSize: 13.5 }}>{p.short}</b>
                          {r.status === "new" && <Badge kind="new">New</Badge>}
                        </div>
                        <div className="small muted" style={{ marginTop: 2 }}>
                          Tree cover {up ? "+" : ""}{r.trigger.delta}% · {r.generated.split(" · ")[0]}
                        </div>
                      </div>
                      <Icon name="chevR" size={16} stroke={2} style={{ color: "var(--muted-2)" }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <SectionTitle>What we spent vs what it's worth</SectionTitle>
          <div className="card">
            <div className="card-pad">
              <BarCompareChart data={compareData} />
              <div className="flex gap20 mt12" style={{ justifyContent: "center" }}>
                <span className="flex center gap8 small muted"><span style={{ width: 12, height: 12, borderRadius: 3, background: "oklch(0.62 0.07 152)" }} /> Spent · {compactTZS(P.investedTZS)} ({compactUSD(D.usd(P.investedTZS))})</span>
                <span className="flex center gap8 small muted"><span style={{ width: 12, height: 12, borderRadius: 3, background: "oklch(0.5 0.12 150)" }} /> Verified worth · {compactTZS(P.verifiedTZS)} ({compactUSD(verifiedUSD)})</span>
              </div>
            </div>
          </div>
        </>
      )}
      <div style={{ height: 30 }} />
    </div>
  );
}

Object.assign(window, { DashboardScreen, compactTZS, compactUSD, DateRange, RANGES, sliceMetric });
