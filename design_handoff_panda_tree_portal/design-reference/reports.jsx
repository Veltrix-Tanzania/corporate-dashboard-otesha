/* ============================================================
   Screen · Reports — saved satellite updates you can filter
   Exposed on window: ReportsScreen
   ============================================================ */

function ReportsScreen({ role, go }) {
  const D = window.APP_DATA;
  const [status, setStatus] = React.useState("all");
  const [proj, setProj] = React.useState("all");
  const [rangeKey, setRangeKey] = React.useState("all");
  const months = window.RANGES.find((r) => r.key === rangeKey).months;

  const list = D.reports.filter((r) =>
    (status === "all" || r.status === status) &&
    (proj === "all" || r.projectId === proj) &&
    (rangeKey === "all" || r.monthsBack <= months));
  const newCount = D.reports.filter((r) => r.status === "new").length;

  return (
    <div className="main-inner">
      <div className="page-head">
        <div>
          <div className="eyebrow">Satellite updates</div>
          <h1 style={{ marginTop: 6 }}>Reports</h1>
          <p className="sub">Every satellite image we save of your projects becomes a short update. Filter them by date or project.</p>
        </div>
        <RoleToggle role={role} setRole={(r) => go({ screen: "reports", role: r })} />
      </div>

      {/* Summary strip */}
      <div className="grid gap16" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="kpi"><div className="kpi-top"><div className="kpi-ico"><Icon name="reports" size={19} stroke={1.8}/></div><div className="kpi-label">Saved updates</div></div><div className="kpi-val">{D.reports.length}</div><div className="kpi-foot muted">across all projects</div></div>
        <div className="kpi"><div className="kpi-top"><div className="kpi-ico" style={{ background: "var(--new-bg)", color: "var(--new-ink)" }}><Icon name="bell" size={18} stroke={1.8}/></div><div className="kpi-label">Not seen yet</div></div><div className="kpi-val">{newCount}</div><div className="kpi-foot muted">new since you last looked</div></div>
        <div className="kpi"><div className="kpi-top"><div className="kpi-ico"><Icon name="satellite" size={18} stroke={1.8}/></div><div className="kpi-label">Last image saved</div></div><div className="kpi-val" style={{ fontSize: 22 }}>Jun 3</div><div className="kpi-foot muted">Sentinel-2 · 4% cloud</div></div>
        <div className="kpi"><div className="kpi-top"><div className="kpi-ico"><Icon name="download" size={18} stroke={1.8}/></div><div className="kpi-label">Filed for ESG</div></div><div className="kpi-val">3</div><div className="kpi-foot muted">PDFs filed this quarter</div></div>
      </div>

      {/* Filters */}
      <div className="flex between center mt24" style={{ flexWrap: "wrap", gap: 12 }}>
        <div className="role-toggle" style={{ boxShadow: "none", background: "var(--tile)" }}>
          {[["all", "All"], ["new", "New"], ["reviewed", "Seen"]].map(([k, l]) => (
            <button key={k} className={status === k ? "on" : ""} onClick={() => setStatus(k)} style={{ padding: "7px 16px" }}>{l}</button>
          ))}
        </div>
        <div className="flex gap10 center" style={{ flexWrap: "wrap" }}>
          <window.DateRange value={rangeKey} setValue={setRangeKey} />
          <div className="flex gap8 center">
            <Icon name="filter" size={15} stroke={1.9} style={{ color: "var(--muted)" }} />
            <select value={proj} onChange={(e) => setProj(e.target.value)}
              style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink-2)", border: "1px solid var(--line)", background: "var(--card)", borderRadius: 999, padding: "8px 14px" }}>
              <option value="all">All projects</option>
              {D.projects.map((p) => <option key={p.id} value={p.id}>{p.short}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="small muted mt12">{list.length} update{list.length === 1 ? "" : "s"}{rangeKey !== "all" ? " in the " + window.RANGES.find((r) => r.key === rangeKey).label.toLowerCase() : ""}</div>

      {/* List */}
      <div className="card mt12">
        {list.map((r) => {
          const p = D.projectById(r.projectId);
          const up = r.trigger.dir === "up";
          return (
            <div key={r.id} className="row click" style={{ gap: 18, padding: "16px 20px" }} onClick={() => go({ screen: "report", id: r.id, role })}>
              <div style={{ width: 96, flex: "none" }}>
                <NDVITile seed={(p.id.length % 6) + 1} height={62} radius={10} label="" mini />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex center gap8" style={{ flexWrap: "wrap" }}>
                  <b style={{ fontSize: 14.5 }}>{r.title}</b>
                  {r.status === "new" && <Badge kind="new">New</Badge>}
                </div>
                <div className="small muted" style={{ marginTop: 3 }}>{p.short} · {r.generated.split(" · ")[0]}</div>
              </div>
              <div style={{ textAlign: "right", flex: "none" }}>
                <div className={"delta " + (up ? "up" : "down")} style={{ fontSize: 13.5 }}>
                  Tree cover {up ? "+" : ""}{r.trigger.delta}%
                </div>
              </div>
              <Icon name="chevR" size={18} stroke={2} style={{ color: "var(--muted-2)" }} />
            </div>
          );
        })}
        {!list.length && <div className="card-pad muted small">No updates match these filters.</div>}
      </div>
      <div style={{ height: 30 }} />
    </div>
  );
}

Object.assign(window, { ReportsScreen });
