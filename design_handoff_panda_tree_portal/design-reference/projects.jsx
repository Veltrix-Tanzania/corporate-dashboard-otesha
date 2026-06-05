/* ============================================================
   Screens · Projects list + Project detail
   Exposed on window: ProjectsScreen, ProjectDetailScreen
   ============================================================ */

function ProjectsScreen({ role, go }) {
  const D = window.APP_DATA;
  return (
    <div className="main-inner">
      <div className="page-head">
        <div>
          <div className="eyebrow">Portfolio</div>
          <h1 style={{ marginTop: 6 }}>Projects</h1>
          <p className="sub">Every tree-planting project CRDB has on the go.</p>
        </div>
        <RoleToggle role={role} setRole={(r) => go({ screen: "projects", role: r })} />
      </div>

      <div className="grid gap16">
        {D.projects.map((p) => {
          const up = p.canopyDelta >= 0;
          return (
            <div key={p.id} className="card click" style={{ cursor: "pointer" }} onClick={() => go({ screen: "project", id: p.id, role })}>
              <div className="card-pad flex between center" style={{ gap: 20 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="flex center gap12">
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 600 }}>{p.name}</h3>
                    <Badge kind="active">{p.status}</Badge>
                  </div>
                  <p className="small muted" style={{ marginTop: 4 }}>{p.blurb}</p>
                  <div className="flex gap20 mt16" style={{ flexWrap: "wrap" }}>
                    <span className="flex center gap8 small"><Icon name="dollar" size={15} stroke={1.8} style={{ color: "var(--muted)" }} /><b>{compactTZS(p.budgetTZS)}</b> <span className="muted">({compactUSD(D.usd(p.budgetTZS))})</span></span>
                    <span className="flex center gap8 small"><Icon name="tree" size={15} stroke={1.8} style={{ color: "var(--muted)" }} /><b>{p.trees.toLocaleString()}</b> <span className="muted">trees</span></span>
                    <span className="flex center gap8 small"><Icon name="pin" size={15} stroke={1.8} style={{ color: "var(--muted)" }} /><b>{p.locations}</b> <span className="muted">locations</span></span>
                    <span className="flex center gap8 small"><Icon name="trend" size={15} stroke={1.8} style={{ color: "var(--muted)" }} /><span className={"delta " + (up ? "up" : "down")} style={{ background: "transparent", padding: 0 }}>{up ? "+" : ""}{p.canopyDelta}% canopy</span></span>
                  </div>
                </div>
                <div style={{ flex: "0 0 200px", maxWidth: 200 }}>
                  <NDVITile seed={(p.id.length % 6) + 1} height={108} radius={12} label={p.short} mini />
                </div>
                <Icon name="chevR" size={20} stroke={2} style={{ color: "var(--muted-2)" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 30 }} />
    </div>
  );
}

function ProjectDetailScreen({ role, id, go }) {
  const D = window.APP_DATA;
  const p = D.projectById(id) || D.projects[0];
  const [hover, setHover] = React.useState(null);
  const exec = role === "exec";
  const rel = D.reports.filter((r) => r.projectId === p.id);

  return (
    <div className="main-inner">
      <a className="crumb" onClick={() => go({ screen: "projects", role })}>
        <Icon name="chevL" size={15} stroke={2.2} /> All Projects
      </a>

      {/* Hero card */}
      <div className="card">
        <div className="card-pad flex between" style={{ alignItems: "flex-start", gap: 20 }}>
          <div>
            <div className="flex center gap12">
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 600 }}>{p.name}</h1>
              <Badge kind="active">{p.status}</Badge>
            </div>
            <p className="sub" style={{ marginTop: 6 }}>{p.blurb}</p>
            <div className="flex gap16 mt12 small muted">
              <span className="flex center gap8"><Icon name="pin" size={14} stroke={1.8} />{p.region}</span>
              <span className="flex center gap8"><Icon name="calendar" size={14} stroke={1.8} />Started {p.started}</span>
              <span className="flex center gap8"><Icon name="leaf" size={14} stroke={1.8} />{p.species} native species</span>
            </div>
          </div>
          <div className="flex gap10" style={{ flex: "none" }}>
            <RoleToggle role={role} setRole={(r) => go({ screen: "project", id: p.id, role: r })} />
          </div>
        </div>
        {/* metric tiles */}
        <div className="card-pad" style={{ paddingTop: 0 }}>
          <div className="grid gap16" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
            <div className="mtile">
              <div className="ml"><Icon name="dollar" size={14} stroke={1.8} /> Budget</div>
              <div className="mv">{compactTZS(p.budgetTZS)} <small>({compactUSD(D.usd(p.budgetTZS))})</small></div>
              <div className="msub">committed capital</div>
            </div>
            <div className="mtile">
              <div className="ml"><Icon name="tree" size={14} stroke={1.8} /> Total trees</div>
              <div className="mv">{p.trees.toLocaleString()}</div>
              <div className="msub">{Math.round(p.survival * 100)}% survival</div>
            </div>
            <div className="mtile">
              <div className="ml"><Icon name="co2" size={14} stroke={1.8} /> CO₂ sequestered</div>
              <div className="mv">{p.co2.toLocaleString()} <small>t</small></div>
              <div className="msub">verified to date</div>
            </div>
            <div className="mtile">
              <div className="ml"><Icon name="trend" size={14} stroke={1.8} /> Canopy change</div>
              <div className="mv" style={{ color: "var(--ok-ink)" }}>+{p.canopyDelta}%</div>
              <div className="msub">NDVI {p.ndviBase} → {p.ndviNow}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Satellite imagery */}
      <div className="card mt20">
        <div className="card-head">
          <h3>Satellite imagery · NDVI</h3>
          <span className="ch-sub">Sentinel-2 · last pass Jun 3, 2026</span>
        </div>
        <div className="card-pad">
          <NDVITile seed={(p.id.length % 6) + 1} height={320} label={"NDVI · " + p.short} />
          {!exec && (
            <div className="grid gap16 mt16" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              <div className="mtile"><div className="ml">NDVI (now)</div><div className="mv">{p.ndviNow}</div></div>
              <div className="mtile"><div className="ml">NDVI (baseline)</div><div className="mv">{p.ndviBase}</div></div>
              <div className="mtile"><div className="ml">Cloud cover</div><div className="mv">4<small>%</small></div></div>
              <div className="mtile"><div className="ml">Tile</div><div className="mv mono" style={{ fontSize: 16 }}>37MET</div></div>
            </div>
          )}
        </div>
      </div>

      {/* Locations: map + table */}
      <div className="grid gap20 mt20" style={{ gridTemplateColumns: exec ? "1fr" : "1.1fr 1fr" }}>
        <div className="card">
          <div className="card-head"><h3>Planting locations</h3><span className="ch-sub">{p.sites.length} sites</span></div>
          <div className="card-pad">
            <SiteMap sites={p.sites} height={exec ? 340 : 320} activeName={hover && hover.name} onHover={setHover} />
          </div>
        </div>
        {!exec && (
          <div className="card">
            <div className="card-head"><h3>Site breakdown</h3></div>
            <div style={{ overflow: "hidden" }}>
              <table className="dtable">
                <thead><tr><th>Site</th><th className="num">Trees</th><th className="num">Survival</th></tr></thead>
                <tbody>
                  {p.sites.map((s, i) => (
                    <tr key={i} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(null)}
                      style={{ background: hover && hover.name === s.name ? "var(--sage-2)" : "transparent" }}>
                      <td><b>{s.name}</b></td>
                      <td className="num">{s.trees.toLocaleString()}</td>
                      <td className="num">
                        <span className="delta up" style={{ background: "transparent", padding: 0 }}>{Math.round(s.surv * 100)}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Related reports */}
      <SectionTitle action={<button className="btn btn-primary btn-sm"><Icon name="download" size={15} stroke={1.9} /> Download report</button>}>
        Reports for this project
      </SectionTitle>
      <div className="card">
        {rel.length ? rel.map((r) => {
          const up = r.trigger.dir === "up";
          return (
            <div key={r.id} className="row click" onClick={() => go({ screen: "report", id: r.id, role })}>
              <div className="r-ico" style={{ background: up ? "var(--ok-bg)" : "#f3ddd6", color: up ? "var(--ok-ink)" : "#8a3320" }}>
                <Icon name="satellite" size={18} stroke={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex center gap8"><b style={{ fontSize: 13.5 }}>{r.title}</b>{r.status === "new" && <Badge kind="new">New</Badge>}</div>
                <div className="small muted mono" style={{ marginTop: 2 }}>{r.id} · {r.generated}</div>
              </div>
              <span className="small muted">{up ? "+" : ""}{r.trigger.delta}%</span>
              <Icon name="chevR" size={16} stroke={2} style={{ color: "var(--muted-2)" }} />
            </div>
          );
        }) : <div className="card-pad muted small">No reports generated yet for this project.</div>}
      </div>
      <div style={{ height: 30 }} />
    </div>
  );
}

Object.assign(window, { ProjectsScreen, ProjectDetailScreen });
