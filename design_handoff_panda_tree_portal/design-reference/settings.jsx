/* ============================================================
   Screen · Report settings (capture cadence + who gets updates)
   Exposed on window: SettingsScreen
   ============================================================ */

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 999, border: 0, padding: 3,
      background: on ? "var(--green)" : "#cdd9ce", transition: "background .15s", display: "flex", justifyContent: on ? "flex-end" : "flex-start" }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)", display: "block" }} />
    </button>
  );
}

function SettingRow({ title, desc, children }) {
  return (
    <div className="row" style={{ alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <b style={{ fontSize: 14 }}>{title}</b>
        <p className="small muted" style={{ marginTop: 3 }}>{desc}</p>
      </div>
      <div style={{ flex: "none" }}>{children}</div>
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="role-toggle" style={{ boxShadow: "none", background: "var(--tile)", width: "100%" }}>
      {options.map((o) => (
        <button key={o} className={value === o ? "on" : ""} onClick={() => onChange(o)} style={{ flex: 1, justifyContent: "center" }}>{o}</button>
      ))}
    </div>
  );
}

function SettingsScreen({ role, go }) {
  const [s, setS] = React.useState({ trees: true, cover: true, co2: true, value: true, pdf: true, email: true });
  const [cadence, setCadence] = React.useState("Every pass");
  const [digest, setDigest] = React.useState("Weekly");
  const t = (k) => setS((v) => ({ ...v, [k]: !v[k] }));

  return (
    <div className="main-inner">
      <div className="page-head">
        <div>
          <div className="eyebrow">Account</div>
          <h1 style={{ marginTop: 6 }}>Report settings</h1>
          <p className="sub">Decide how often we save a satellite image, what each update shows, and who gets it.</p>
        </div>
        <RoleToggle role={role} setRole={(r) => go({ screen: "settings", role: r })} />
      </div>

      <div className="grid gap20" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div className="grid gap20">
          {/* Capture */}
          <div className="card">
            <div className="card-head"><h3>Satellite images</h3><span className="ch-sub">Sentinel-2 · ~5 day revisit</span></div>
            <div className="card-pad">
              <div className="small muted" style={{ marginBottom: 10 }}>How often we save a fresh image of your projects</div>
              <Segmented options={["Every pass", "Monthly", "Quarterly"]} value={cadence} onChange={setCadence} />
            </div>
            <SettingRow title="Save an update each time" desc="Turn each saved image into a short, shareable update.">
              <span className="badge mut"><span className="dot" />Always</span>
            </SettingRow>
          </div>

          {/* What's in an update */}
          <div className="card">
            <div className="card-head"><h3>What each update shows</h3></div>
            <SettingRow title="Trees planted & survival" desc="How many trees are in the ground and how many are still alive.">
              <Toggle on={s.trees} onClick={() => t("trees")} />
            </SettingRow>
            <SettingRow title="Tree cover change" desc="How much greener the satellite image looks versus the last one.">
              <Toggle on={s.cover} onClick={() => t("cover")} />
            </SettingRow>
            <SettingRow title="CO₂ stored" desc="An estimate of the carbon captured so far.">
              <Toggle on={s.co2} onClick={() => t("co2")} />
            </SettingRow>
            <SettingRow title="Verified value" desc="The value of the verified impact, in TZS and USD.">
              <Toggle on={s.value} onClick={() => t("value")} />
            </SettingRow>
          </div>

          {/* Formats */}
          <div className="card">
            <div className="card-head"><h3>How updates are shared</h3></div>
            <SettingRow title="Dashboard card" desc="Always on — shows up in your portfolio overview.">
              <span className="badge mut"><span className="dot" />Always</span>
            </SettingRow>
            <SettingRow title="PDF for ESG filing" desc="A formatted PDF you can file to your ESG register.">
              <Toggle on={s.pdf} onClick={() => t("pdf")} />
            </SettingRow>
            <SettingRow title="Email digest" desc="A short email when a new update is saved.">
              <Toggle on={s.email} onClick={() => t("email")} />
            </SettingRow>
          </div>
        </div>

        {/* Recipients */}
        <div className="grid gap20" style={{ alignContent: "start" }}>
          <div className="card">
            <div className="card-head"><h3>Who gets updates</h3></div>
            <div className="card-pad grid gap16">
              <div className="mtile" style={{ background: "var(--tile)" }}>
                <div className="flex center gap8"><Icon name="hardhat" size={16} stroke={1.9} style={{ color: "var(--green-deep)" }} /><b style={{ fontSize: 13.5 }}>Sustainability managers</b></div>
                <p className="small muted" style={{ marginTop: 6, lineHeight: 1.5 }}>Get the fuller picture — the saved image, site-by-site numbers and the ESG-ready PDF.</p>
                <div className="flex gap8 mt12"><span className="tag">2 people</span><span className="tag">More detail</span></div>
              </div>
              <div className="mtile" style={{ background: "var(--tile)" }}>
                <div className="flex center gap8"><Icon name="briefcase" size={15} stroke={1.9} style={{ color: "var(--green-deep)" }} /><b style={{ fontSize: 13.5 }}>Decision makers</b></div>
                <p className="small muted" style={{ marginTop: 6, lineHeight: 1.5 }}>Get the short version — a plain-language headline, the key numbers and a one-pager.</p>
                <div className="flex gap8 mt12"><span className="tag">3 people</span><span className="tag">Short version</span></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Email digest</h3></div>
            <div className="card-pad">
              <Segmented options={["Instant", "Weekly", "Monthly"]} value={digest} onChange={setDigest} />
              <p className="small muted mt12" style={{ lineHeight: 1.5 }}>How often we bundle saved updates into an email. Big changes always send straight away.</p>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }}><Icon name="check" size={16} stroke={2.2} /> Save settings</button>
        </div>
      </div>
      <div style={{ height: 30 }} />
    </div>
  );
}

Object.assign(window, { SettingsScreen });
