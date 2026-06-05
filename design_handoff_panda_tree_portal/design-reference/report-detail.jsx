/* ============================================================
   Screen · Report detail — high-level satellite update
   (no detection pipeline; just the saved image + the numbers)
   Exposed on window: ReportDetailScreen
   ============================================================ */

function ReportDetailScreen({ role, id, go }) {
  const D = window.APP_DATA;
  const r = D.reportById(id) || D.reports[0];
  const p = D.projectById(r.projectId);
  const exec = role === "exec";
  const up = r.trigger.dir === "up";
  const tg = r.trigger;
  const co2Add = Math.round(p.co2 * (tg.delta / 100) * 4) || 18;

  return (
    <div className="main-inner">
      <a className="crumb" onClick={() => go({ screen: "reports", role })}>
        <Icon name="chevL" size={15} stroke={2.2} /> Reports
      </a>

      {/* Header */}
      <div className="card">
        <div className="card-pad flex between" style={{ alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <div className="flex center gap8" style={{ flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: 25, fontWeight: 600 }}>{r.title}</h1>
              {r.status === "new" ? <Badge kind="new">New</Badge> : <Badge kind="active">{p.status}</Badge>}
            </div>
            <p className="sub" style={{ marginTop: 6 }}>{p.name} · saved {r.generated.split(" · ")[0]}</p>
          </div>
          <div style={{ flex: "none", textAlign: "right" }}>
            <RoleToggle role={role} setRole={(rr) => go({ screen: "report", id: r.id, role: rr })} />
            <div className="flex gap10 mt12" style={{ justifyContent: "flex-end" }}>
              {r.formats.includes("pdf") && <button className="btn btn-primary btn-sm"><Icon name="download" size={15} stroke={1.9} /> Download PDF</button>}
              {r.formats.includes("email") && <button className="btn btn-ghost btn-sm"><Icon name="mail" size={15} stroke={1.9} /> Email me this</button>}
            </div>
          </div>
        </div>
        {/* headline */}
        <div style={{ padding: "0 24px 22px" }}>
          <div style={{ background: up ? "var(--ok-bg)" : "#f3ddd6", color: up ? "var(--ok-ink)" : "#8a3320", borderRadius: "var(--r-md)", padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}>
            <Icon name={up ? "trend" : "alert"} size={22} stroke={2} />
            <p style={{ fontFamily: "var(--serif)", fontSize: 16.5, fontWeight: 500, lineHeight: 1.4, textWrap: "pretty" }}>{r.headline}</p>
          </div>
        </div>
      </div>

      {/* High-level numbers */}
      <div className="grid gap16 mt20" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="mtile">
          <div className="ml"><Icon name="trend" size={14} stroke={1.8} /> Tree cover</div>
          <div className="mv" style={{ color: up ? "var(--ok-ink)" : "#8a3320" }}>{up ? "+" : ""}{tg.delta}%</div>
          <div className="msub">since the last image</div>
        </div>
        <div className="mtile">
          <div className="ml"><Icon name="tree" size={14} stroke={1.8} /> Trees</div>
          <div className="mv">{p.trees.toLocaleString()}</div>
          <div className="msub">{Math.round(p.survival * 100)}% still alive</div>
        </div>
        <div className="mtile">
          <div className="ml"><Icon name="co2" size={14} stroke={1.8} /> CO₂ stored</div>
          <div className="mv">{p.co2.toLocaleString()} <small>t</small></div>
          <div className="msub">{up ? "+" : ""}{co2Add} t this update</div>
        </div>
        <div className="mtile">
          <div className="ml"><Icon name="dollar" size={14} stroke={1.8} /> Verified value</div>
          <div className="mv">{compactTZS(p.verifiedTZS)}</div>
          <div className="msub">{compactUSD(D.usd(p.verifiedTZS))}</div>
        </div>
      </div>

      {/* The saved satellite image */}
      <div className="card mt20">
        <div className="card-head">
          <h3>Satellite imagery</h3>
          <span className="ch-sub">{tg.sensor} · saved {tg.pass}</span>
        </div>
        <div className="card-pad">
          <NDVITile seed={(p.id.length % 6) + 1} height={340} label={"Satellite view · " + p.short} />
        </div>
      </div>

      {/* Short summary — role aware, still high level */}
      <div className="card card-pad mt20">
        <div className="eyebrow" style={{ marginBottom: 10 }}>{exec ? "In short" : "What this update covers"}</div>
        <p style={{ fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.55, color: "var(--ink)", textWrap: "pretty" }}>
          {exec ? (
            <>The newest satellite image shows {p.short} is {up ? "doing well" : "being looked after"}. Tree cover is
            {up ? " up" : " down"} <b>{up ? "+" : ""}{tg.delta}%</b> since the last one, which is about <b>{up ? "+" : ""}{co2Add} tonnes</b> of CO₂.
            Nothing needs your attention — we've filed it to your ESG register.</>
          ) : (
            <>We saved this image on <b>{tg.pass}</b> from {tg.sensor}. Compared with the last one, tree cover across {p.short}'s
            {" "}{p.sites.length} site{p.sites.length === 1 ? "" : "s"} is {up ? "up" : "down"} <b>{up ? "+" : ""}{tg.delta}%</b>. The numbers above are
            rolled up from all of those sites.</>
          )}
        </p>

        {!exec && (
          <div className="grid gap12 mt20" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
            {p.sites.slice(0, 6).map((s, i) => (
              <div key={i} className="flex between center" style={{ padding: "10px 14px", background: "var(--tile)", borderRadius: "var(--r-sm)" }}>
                <span className="small strong" style={{ color: "var(--ink-2)" }}>{s.name}</span>
                <span className="small muted">{s.trees.toLocaleString()} trees · {Math.round(s.surv * 100)}%</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap12 mt20" style={{ flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={() => go({ screen: "project", id: p.id, role })}>
            <Icon name="eye" size={16} stroke={1.9} /> Open the project
          </button>
          {r.formats.includes("pdf") && <button className="btn btn-ghost"><Icon name="download" size={16} stroke={1.9} /> Download PDF</button>}
        </div>
      </div>

      <div style={{ height: 30 }} />
    </div>
  );
}

Object.assign(window, { ReportDetailScreen });
