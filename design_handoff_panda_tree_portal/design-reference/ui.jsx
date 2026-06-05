/* ============================================================
   Shared UI — Icon set, Sidebar, RoleToggle, KPI, Badge, Alert
   Exposed on window
   ============================================================ */

function Icon({ name, size = 18, stroke = 2, ...rest }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", ...rest };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    projects: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></>,
    reports: <><path d="M14 3v5h5"/><path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7z"/><path d="M9 13h6M9 17h4"/></>,
    bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
    leaf: <><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 12-9 0 8-4 12-9 12-2 0-4 1-4 4"/><path d="M11 20c0-4 2-7 6-9"/></>,
    tree: <><path d="M12 2 7 9h3l-4 6h5v5h2v-5h5l-4-6h3z"/></>,
    dollar: <><path d="M12 2v20M17 6.5C17 4.6 14.8 4 12 4S7 4.9 7 7s2.2 3 5 3.5 5 1.4 5 3.5-2.2 3-5 3-5-.6-5-2.5"/></>,
    pin: <><path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></>,
    trend: <><path d="M3 17l6-6 4 4 8-8"/><path d="M21 11V7h-4"/></>,
    co2: <><circle cx="12" cy="12" r="9"/><path d="M9 9.5A2.5 2.5 0 1 0 9 14M15.5 9.5h-1.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-1.5"/></>,
    download: <><path d="M12 3v12"/><path d="M7 11l5 4 5-4"/><path d="M5 21h14"/></>,
    chevR: <path d="M9 6l6 6-6 6"/>,
    chevL: <path d="M15 6l-6 6 6 6"/>,
    chevD: <path d="M6 9l6 6 6-6"/>,
    arrowUR: <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
    satellite: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    check: <path d="M5 12l5 5L20 7"/>,
    alert: <><path d="M10.3 4 2.5 18a1.5 1.5 0 0 0 1.3 2.2h16.4a1.5 1.5 0 0 0 1.3-2.2L13.7 4a1.5 1.5 0 0 0-2.6 0Z"/><path d="M12 9v4M12 17h.01"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></>,
    hardhat: <><path d="M4 16a8 8 0 0 1 16 0"/><path d="M10 8.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3.5M2 16h20v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></>,
    signout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></>,
    filter: <><path d="M3 5h18l-7 8v6l-4 2v-8z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 18l9 5 9-5" opacity="0.5"/></>,
    drop: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="var(--card)"/><circle cx="15" cy="12" r="2" fill="var(--card)"/><circle cx="8" cy="18" r="2" fill="var(--card)"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M19 19H6a2 2 0 0 0-2 2"/></>,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
}

/* ---- Sidebar ---- */
function Sidebar({ route, go, newCount }) {
  const D = window.APP_DATA;
  const item = (id, icon, label, badge) => (
    <a className={"sb-link" + (route.screen === id ? " active" : "")} onClick={() => go({ screen: id })}>
      <Icon name={icon} size={18} stroke={1.8} />
      {label}
      {badge ? <span className="badge-dot">{badge}</span> : null}
    </a>
  );
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo"><Icon name="tree" size={20} stroke={1.6} /></div>
        <div>
          <b>{D.company.portal}</b>
          <span>Corporate Portal</span>
        </div>
      </div>
      <nav className="sb-nav">
        {item("dashboard", "dashboard", "Dashboard")}
        {item("projects", "projects", "Projects")}
        {item("reports", "reports", "Reports", newCount)}
        <div className="sb-section">Account</div>
        {item("settings", "sliders", "Report settings")}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="av">AM</div>
          <div style={{ minWidth: 0 }}>
            <b>{D.company.user}</b>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{D.company.email}</span>
          </div>
        </div>
        <a className="sb-signout"><Icon name="signout" size={16} stroke={1.8} /> Sign out</a>
      </div>
    </aside>
  );
}

/* ---- Role toggle ---- */
function RoleToggle({ role, setRole }) {
  return (
    <div className="role-toggle" role="tablist" aria-label="View as">
      <button className={role === "manager" ? "on" : ""} onClick={() => setRole("manager")}>
        <span className="rt-ico"><Icon name="hardhat" size={16} stroke={1.9} /></span>
        Sustainability Manager
      </button>
      <button className={role === "exec" ? "on" : ""} onClick={() => setRole("exec")}>
        <span className="rt-ico"><Icon name="briefcase" size={15} stroke={1.9} /></span>
        Decision Maker
      </button>
    </div>
  );
}

/* ---- Badge ---- */
function Badge({ kind = "active", children }) {
  return <span className={"badge " + kind}><span className="dot" />{children}</span>;
}

/* ---- KPI card ---- */
function KPI({ icon, label, value, unit, sub, delta, deltaDir = "up", spark, sparkColor }) {
  return (
    <div className="kpi fade-in">
      <div className="kpi-top">
        <div className="kpi-ico"><Icon name={icon} size={20} stroke={1.8} /></div>
        <div className="kpi-label">{label}</div>
        {spark && <div style={{ marginLeft: "auto" }}><MiniSpark series={spark} color={sparkColor} /></div>}
      </div>
      <div className="kpi-val">{value}{unit && <small>{unit}</small>}</div>
      <div className="kpi-foot">
        {delta != null && (
          <span className={"delta " + deltaDir}>
            <Icon name={deltaDir === "down" ? "trend" : "trend"} size={12} stroke={2.4} style={{ transform: deltaDir === "down" ? "scaleY(-1)" : "none" }} />
            {delta}
          </span>
        )}
        <span>{sub}</span>
      </div>
    </div>
  );
}

/* ---- Section title row ---- */
function SectionTitle({ children, action }) {
  return (
    <div className="flex between center" style={{ margin: "30px 0 14px" }}>
      <h2 className="sectiontitle">{children}</h2>
      {action}
    </div>
  );
}

/* ---- Alert banner ---- */
function AlertBanner({ alert, onView }) {
  return (
    <div className="alert fade-in">
      <div className="al-stripe" />
      <div className="al-body">
        <div className="al-ico"><Icon name="satellite" size={20} stroke={1.8} /></div>
        <div className="al-text">
          <b>{alert.title}</b>
          <p>{alert.body}</p>
        </div>
        <div className="al-actions">
          <span className="badge new"><span className="dot" />{alert.time}</span>
          <button className="btn btn-primary btn-sm" onClick={onView}>
            View report <Icon name="chevR" size={15} stroke={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Format chips ---- */
function FormatChips({ formats }) {
  const map = { dashboard: ["dashboard", "Dashboard card"], pdf: ["download", "PDF · ESG"], email: ["mail", "Email digest"] };
  return (
    <div className="flex gap8" style={{ flexWrap: "wrap" }}>
      {formats.map((f) => (
        <span key={f} className="tag"><Icon name={map[f][0]} size={13} stroke={1.9} />{map[f][1]}</span>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Sidebar, RoleToggle, Badge, KPI, SectionTitle, AlertBanner, FormatChips });
