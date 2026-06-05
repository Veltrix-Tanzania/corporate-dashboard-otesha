/* ============================================================
   Map + Satellite NDVI tile
   Exposed on window: NDVITile, SiteMap
   ============================================================ */

/* ---- Procedural NDVI heatmap (looks like canopy satellite imagery) ---- */
function NDVITile({ seed = 3, height = 300, label = "Satellite NDVI", radius = 14, mini = false, children }) {
  const fid = "ndvi" + seed;
  return (
    <div className="satmap" style={{ height, borderRadius: radius }}>
      {/* base wash so it never renders empty if filter unsupported */}
      <div style={{ position: "absolute", inset: 0,
        background: "radial-gradient(120% 120% at 30% 20%, oklch(0.55 0.13 145), oklch(0.42 0.10 150) 55%, oklch(0.78 0.15 100) 100%)" }} />
      <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, display: "block" }}>
        <defs>
          <filter id={fid} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016 0.02" numOctaves="4" seed={seed} stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" result="g" />
            <feComponentTransfer in="g" result="c">
              <feFuncR type="table" tableValues="0.06 0.14 0.34 0.62 0.86 0.97" />
              <feFuncG type="table" tableValues="0.22 0.40 0.58 0.72 0.84 0.93" />
              <feFuncB type="table" tableValues="0.10 0.12 0.13 0.16 0.22 0.34" />
              <feFuncA type="table" tableValues="1 1" />
            </feComponentTransfer>
          </filter>
          <filter id={fid + "p"}>
            <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" seed={seed + 4} result="p" />
            <feColorMatrix in="p" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
          </filter>
        </defs>
        <rect width="600" height="300" filter={`url(#${fid})`} />
        {/* faint road vectors */}
        <g stroke="#cfe0d3" strokeOpacity="0.35" strokeWidth="1.4" fill="none">
          <path d={`M0 ${70 + seed * 6} Q 160 ${40 + seed} 300 110 T 600 90`} />
          <path d="M120 0 Q 180 140 140 300" />
          <path d="M0 220 Q 220 200 380 250 T 600 220" />
        </g>
        <rect width="600" height="300" filter={`url(#${fid}p)`} />
      </svg>
      {!mini && (
      <div className="map-legend">
        <div style={{ fontWeight: 700, color: "#eaf3ec", marginBottom: 2 }}>NDVI</div>
        <div className="lg"><span className="sw" style={{ background: "oklch(0.42 0.10 150)" }}></span>Dense canopy</div>
        <div className="lg"><span className="sw" style={{ background: "oklch(0.62 0.12 135)" }}></span>Regrowth</div>
        <div className="lg"><span className="sw" style={{ background: "oklch(0.86 0.15 100)" }}></span>Sparse / bare</div>
      </div>
      )}
      {label && (
      <div className="map-chip">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
        {label}
      </div>
      )}
      {children}
    </div>
  );
}

/* ---- Stylized planting-site map with markers ---- */
function SiteMap({ sites = [], height = 360, activeName, onHover }) {
  const maxT = Math.max(...sites.map((s) => s.trees), 1);
  return (
    <div className="sitemap" style={{ height,
      background: "linear-gradient(160deg, #e9f1ea, #dfeae0)" }}>
      {/* soft landmass + water */}
      <svg width="100%" height="100%" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="land" cx="45%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#dcebdd" />
            <stop offset="100%" stopColor="#cfe0d1" />
          </radialGradient>
        </defs>
        <rect width="600" height="360" fill="#cfdfe4" />
        <path d="M-20 60 C 120 20 240 70 330 50 C 430 28 540 70 640 50 L 640 380 L -20 380 Z" fill="url(#land)" />
        {/* contour lines */}
        <g stroke="#bcd2bf" strokeOpacity="0.6" fill="none" strokeWidth="1">
          <path d="M40 140 Q 200 100 360 150 T 620 140" />
          <path d="M20 200 Q 200 170 380 210 T 640 200" />
          <path d="M60 260 Q 220 240 400 270 T 660 260" />
        </g>
        {/* river */}
        <path d="M120 -10 C 160 120 90 200 200 300 S 260 360 240 380" stroke="#9fc0cb" strokeWidth="5" fill="none" strokeOpacity="0.7" strokeLinecap="round" />
        {/* roads */}
        <g stroke="#fff" strokeWidth="2.4" strokeOpacity="0.8" fill="none">
          <path d="M0 110 Q 300 90 600 130" />
          <path d="M250 0 Q 230 180 300 360" />
        </g>
      </svg>
      {sites.map((s, i) => {
        const sz = 12 + (s.trees / maxT) * 26;
        const active = s.name === activeName;
        return (
          <div key={i} className="pin" style={{ left: s.x + "%", top: s.y + "%", zIndex: active ? 5 : 2 }}
            onMouseEnter={() => onHover && onHover(s)} onMouseLeave={() => onHover && onHover(null)}>
            {active && <span className="pin-ring" style={{ width: sz, height: sz }} />}
            <span className="pin-dot" style={{ width: sz, height: sz, display: "block",
              background: active ? "oklch(0.66 0.12 78)" : "oklch(0.5 0.12 150)" }} />
            <div style={{ position: "absolute", left: "50%", top: "calc(100% + 5px)", transform: "translateX(-50%)",
              whiteSpace: "nowrap", fontSize: 10.5, fontWeight: 700, color: "var(--ink)",
              background: "rgba(255,255,255,.82)", padding: "1px 7px", borderRadius: 6,
              opacity: active ? 1 : 0, transition: "opacity .15s", pointerEvents: "none" }}>
              {s.name} · {s.trees.toLocaleString()}
            </div>
          </div>
        );
      })}
      <div className="map-chip">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
        {sites.length} planting site{sites.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}

Object.assign(window, { NDVITile, SiteMap });
