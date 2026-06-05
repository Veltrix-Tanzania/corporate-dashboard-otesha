# Handoff: Otesha — Corporate Sustainability Portal

## Overview

A web portal for **corporate sustainability accounts** to monitor the tree-planting
projects they fund. The reference account is **CRDB Bank (Tanzania)**, funding four
reforestation projects. The portal turns satellite imagery (Sentinel-2 NDVI) into
plain-language **"satellite updates"** (reports), and surfaces portfolio-level impact:
trees planted, survival rate, CO₂ stored, tree-cover gain, and verified value
(in TZS with a USD conversion).

The defining product idea is a **role toggle** that appears on every screen and rewrites
the depth of every view:

- **Decision Maker** (`exec`) — the short version: plain-language headlines, the few numbers that matter, one-pager PDFs.
- **Sustainability Manager** (`manager`) — the fuller picture: site-by-site tables, NDVI detail, more charts.

Five screens, all client-side routed: **Dashboard, Projects (list), Project detail,
Reports (list), Report detail, Report settings.**

---

## About the Design Files

The files in `design-reference/` are a **design reference built in HTML + React (via
in-browser Babel)**. They are a prototype that demonstrates the intended look, layout,
data shape, and interactions — **not production code to ship as-is.** The Babel-in-the-browser
setup, the global `window.*` component exports, and the mock `data.js` are prototyping
conveniences, not architectural recommendations.

**Your task is to recreate these designs in the target codebase's own environment**
(React + a build step, Vue, Svelte, SwiftUI, etc.), using its established component
library, routing, state management, and data-fetching patterns. If there is no existing
codebase yet, choose an appropriate modern stack (the design maps cleanly onto React +
Vite + TypeScript with a real chart approach) and implement there.

Everything in this README is sufficient to rebuild the portal **without** reading the
prototype source, but the source is included for exact reference.

## Fidelity

**High-fidelity.** Colors, typography, spacing, radii, shadows, and interactions are all
final and intentional. Recreate the UI **pixel-accurately** using the target codebase's
libraries. Treat the values in the Design Tokens section as the source of truth.

The two visual elements that are *procedurally faked* in the prototype and need **real
data/assets** in production are called out explicitly below:
1. The **NDVI satellite tiles** (drawn with SVG `feTurbulence` noise) → real Sentinel-2 NDVI raster tiles.
2. The **site maps** (stylized SVG landmass + percentage-positioned pins) → a real map library (Mapbox / MapLibre / Leaflet) with real lat/lng.

---

## Design Tokens

All tokens are defined as CSS custom properties in `design-reference/styles.css` under `:root`.

### Color — Surfaces
| Token | Value | Use |
|---|---|---|
| `--forest` | `#15352a` | Sidebar background |
| `--forest-2` | `#1c4234` | Sidebar elevated (logo chip) |
| `--forest-pill` | `#34564a` | Active nav pill, sidebar avatar |
| `--sage` | `#d9e6da` | App canvas background |
| `--sage-2` | `#e6efe6` | Subtle band / row hover |
| `--card` | `#ffffff` | Card surface |
| `--tile` | `#eaf2eb` | Metric tile / inset surface |
| `--line` | `#e2ebe3` | Hairline border on white |
| `--line-sage` | `#c4d6c6` | Hairline on sage |

### Color — Ink (text)
| Token | Value | Use |
|---|---|---|
| `--ink` | `#16352a` | Headings (deep green-black) |
| `--ink-2` | `#324b3e` | Body emphasis |
| `--muted` | `#5f7468` | Secondary text |
| `--muted-2` | `#88998f` | Tertiary text / chart labels |
| `--on-forest` | `#f2f7f2` | Text on the dark sidebar |
| `--on-forest-mut` | `#9bb3a4` | Muted text on sidebar |

### Color — Accents (shared chroma/lightness, hue varies; oklch)
| Token | Value |
|---|---|
| `--green` | `oklch(0.55 0.11 150)` |
| `--green-deep` | `oklch(0.42 0.09 152)` |
| `--teal` | `oklch(0.58 0.10 205)` |
| `--gold` | `oklch(0.66 0.11 82)` — NDVI warm / alert stripe |
| `--rust` | `oklch(0.58 0.12 40)` — alert / decline |
| `--sky` | `oklch(0.60 0.10 240)` |

### Color — Status
| Token | Value | Use |
|---|---|---|
| `--ok` / `--ok-bg` / `--ok-ink` | `oklch(0.55 0.11 150)` / `#dcebdd` / `#2c5a3d` | Positive (up) |
| `--warn` / `--warn-bg` / `--warn-ink` | `oklch(0.66 0.12 70)` / `#f6ecd6` / `#7a5a14` | Warning |
| `--new-bg` / `--new-ink` | `#dde8f3` / `#2c4d75` | "New" badge |
| Down/decline (inline) | bg `#f3ddd6`, ink `#8a3320` | Negative delta |

### Typography
Three Google Fonts:
- **`--serif`**: `"Newsreader"` (serif display) — page titles (h1), KPI values, big numbers, narrative paragraphs. Weights 400–700; uses optical-size axis `opsz 6..72`.
- **`--sans`**: `"Hanken Grotesk"` — all UI text, labels, body. Weights 400/500/600/700.
- **`--mono`**: `"IBM Plex Mono"` — IDs (`RPT-2026-0142`), timestamps, chart-axis numbers, tile codes. Weights 400/500.

Type scale (representative):
| Element | Font | Size | Weight | Other |
|---|---|---|---|---|
| Page title `h1` | serif | 30px | 600 | `letter-spacing: -.01em; line-height: 1.05` |
| Section title | serif | 18px | 600 | |
| KPI value | serif | 30px | 600 | `line-height: 1` |
| Impact big number | serif | 34px | 600 | |
| Card-head `h3` | sans | 12px | 700 | UPPERCASE, `letter-spacing: .1em` |
| KPI label | sans | 11px | 700 | UPPERCASE, `letter-spacing: .09em` |
| Eyebrow | sans | 11px | 700 | UPPERCASE, `letter-spacing: .11em` |
| Body / `.small` | sans | 13–14px / 12.5px | 400–600 | |
| Nav link | sans | 14px | 500 | |
| Table header `th` | sans | 10.5px | 700 | UPPERCASE, `letter-spacing: .08em` |
| Mono (IDs/time) | mono | 11.5–12px | 400 | |

### Geometry — radius
`--r-lg: 20px` (cards, KPIs) · `--r-md: 14px` (tiles, maps, headline box) · `--r-sm: 10px` (icon chips, small inset) · `--r-xs: 8px` · pills/badges/buttons: `999px`.

### Geometry — shadows
- `--shadow`: `0 1px 2px rgba(20,50,40,.05), 0 6px 20px -10px rgba(20,50,40,.16)` (cards)
- `--shadow-lg`: `0 2px 6px rgba(20,50,40,.06), 0 24px 48px -22px rgba(20,50,40,.28)` (dropdowns)

### Layout
- `--sidebar-w: 256px` — fixed left sidebar.
- `.main` content area: `margin-left: 256px; padding: 30px 40px 80px`.
- `.main-inner`: `max-width: 1180px; margin: 0 auto` (content column).
- Card padding: `.card-pad` = `22px 24px`; `.card-head` = `18px 24px`.
- Standard grid gaps: 16px (KPI grid, tile grids) and 20px (two-column card layouts).

---

## App Shell & Navigation

### Sidebar (fixed, 256px, `--forest` background)
Top → bottom:
1. **Brand block** — 40×40 circular logo chip (`--forest-2`, tree icon, `#bcd3c2`), then `Otesha` (15px bold) over `Corporate Portal` (12px, `--on-forest-mut`). Bottom hairline `rgba(255,255,255,.06)`.
2. **Nav** (`padding: 14px`, vertical, `gap: 3px`):
   - Dashboard, Projects, Reports
   - Section label **ACCOUNT** (10.5px, uppercase, `.12em` tracking, muted)
   - Report settings
   - Each link: 18px icon + label, `padding: 10px 12px`, radius `--r-sm`. Default ink `#c6d8cb`. **Hover**: bg `rgba(255,255,255,.045)`, ink `#e6f0e8`. **Active**: bg `--forest-pill`, ink `#fff`.
   - **Reports** link shows a count badge (the number of `new` reports) right-aligned: gold pill (`--gold` bg, `#3a2a00` ink, 10.5px/700, radius 999px).
3. **Footer** (`margin-top: auto`, top hairline): 34px circular avatar `AM` (`--forest-pill`), name `Almas Mchauru` (13px bold), email `almasemilius@icloud.com` (11.5px muted, ellipsised). Below: a **Sign out** row (signout icon + label, `#9bb3a4`, hover `#d7e6da`).

### Routing & active state
Single-page client routing over a route object `{ screen, role, id? }`:
- `screen` ∈ `dashboard | projects | project | reports | report | settings`
- `role` ∈ `exec | manager` (default `exec`)
- `id` — project id or report id for detail screens.

Active-nav resolution: a **report** detail keeps **Reports** highlighted; a **project** detail keeps **Projects** highlighted.

**Persistence:** the entire route object is written to `localStorage` under key `pt_route` on every change, and restored on load (default `{ screen: "dashboard", role: "exec" }`). On any screen/id change, scroll the main area and window back to top (do **not** use `scrollIntoView`).

**Screen transition:** the content column fades/rises in on each route change — `fade-in`: `@keyframes` from `translateY(7px)` to none over `.35s ease`. Keyed on `screen + id + role` so it replays when any of those change.

---

## The Role Toggle (global, appears on every screen)

A pill-shaped segmented control (`.role-toggle`): white card, `--line` border, `box-shadow: --shadow`, radius 999px, 4px padding. Two buttons:
- **Sustainability Manager** — hardhat icon, value `manager`.
- **Decision Maker** — briefcase icon, value `exec`.

Inactive button: transparent bg, `--muted` text, 13px/600. **Active** button (`.on`): bg `--ink`, text `#eaf3ec`, `box-shadow: 0 2px 8px -2px rgba(20,50,40,.4)`. Color transitions `.15s`.

Changing the role updates `route.role` **in place on the current screen** (same screen, same id, new role) — it must not navigate away. Because role lives in the persisted route, it survives reload and is shared across every screen.

---

## Screens

### 1. Dashboard (`screen: "dashboard"`)

**Header** (`.page-head`, flex, baseline-aligned, space-between):
- Left: eyebrow `SUSTAINABILITY PORTFOLIO`, h1 = account name (`CRDB`), sub = "Here's how all of CRDB's tree-planting work is doing right now."
- Right: the **Role toggle**, then below it a row with the **date-range dropdown** and a primary button — label is **"Get the brief"** (exec) / **"Export data"** (manager), download icon. Clicking it routes to Reports.

**Satellite alert banner** (`.alert`) — full-width card with a 5px **gold** left stripe, a 40px warning-tinted icon chip (satellite icon), a title + body, and on the right a "New … 2h ago" blue badge plus a primary "View report →" button that opens the linked report. Content comes from `alerts[0]`.

**KPI row** — 4-up grid (`repeat(4,1fr)`, gap 16). Each `.kpi` is a white `--r-lg` card, `padding: 20px 22px`, with:
- top row: 38px icon chip (`--tile` bg, `--green-deep` icon) + uppercase label, optional **mini-sparkline** pushed right.
- value in serif 30px (with optional `<small>` unit in sans).
- foot: a **delta pill** + sub text.

The four KPIs: **Active projects** (`4`, "+1", "6 planting sites"), **Trees planted** (`128.4k`, "87% still alive", spark), **CO₂ stored** (`2,340 t`, "+%", spark), **Verified value** (`TZS 1.49B`, "$… · …% above what we spent"). **The deltas are period-aware** — they recompute from the selected date range (see below).

**Delta pill** (`.delta`): inline pill, 12px/700. `.up` = `--ok-ink` on `--ok-bg`; `.down` = `#8a3320` on `#f3ddd6`; `.flat` = muted on `--tile`. Up/down uses a trend icon (down = `scaleY(-1)`).

**"Impact over time"** card (`SectionTitle` + card) — the date-filtered centerpiece:
- Card head: a row of 4 **metric toggle pills** — CO₂ stored / Trees planted / Tree cover gain / Verified value (active pill = `--ink` bg / `#eaf3ec`; inactive = white, `--line` border, muted) — and a **date-range dropdown** on the right.
- Body: a large serif number (34px, colored per metric) = the impact gained over the selected period, a sub-line "{metric word} {in the last N months | so far}" with a +% delta (hidden for canopy), and a right-aligned "Running total" value.
- Below: an **area trend chart** (`AreaTrend`) for the sliced series, colored per metric.

**Date-range dropdown** (`DateRange`): a ghost button (calendar icon + current label + chevron). Opens a `--shadow-lg` card menu listing **Last 3 months / Last 6 months / Last 12 months / All time**; the active row gets `--tile` bg and a check icon. Closes on outside click. Maps to month windows of 3/6/12/23. Default on dashboard = **6m**.

#### Role-specific dashboard body

**Decision Maker (`exec`):**
- **"The short version"** card: a large serif narrative paragraph (20px, `line-height 1.55`, `text-wrap: pretty`) summarizing the portfolio with bolded numbers, two CTA buttons ("Download the one-pager (PDF)" primary → opens report `RPT-2026-0142`; "See all reports" ghost). On the right, **two donut stats** in metric tiles: "Trees still alive" (87%) and "How sure the checks are" (94%, gold).
- A two-column grid (`1.3fr 1fr`): **"What we spent vs what it's worth"** (grouped bar chart + legend) and **"Where the work is happening"** (site map, 300px).

**Sustainability Manager (`manager`):**
- **"How the projects are doing"** section (with an "All reports →" quiet button) → two-column grid: **"Trees planted and how many survived"** (combo bar+line chart + legend) and **"Tree cover gain"** (area trend over quarters, "+11.6% so far").
- Two-column grid (`1.25fr 1fr`): **"Planting sites"** (large site map, 320px, "{N} sites · {N} locations") and **"Latest satellite updates"** (a list of the 4 most recent reports as clickable rows).
- **"What we spent vs what it's worth"** full-width bar chart with a detailed legend showing TZS+USD totals.

### 2. Projects list (`screen: "projects"`)
Header: eyebrow `PORTFOLIO`, h1 "Projects", sub "Every tree-planting project CRDB has on the go.", role toggle on the right.

Body: a vertical stack (gap 16) of **clickable project cards**. Each card (`flex`, space-between, gap 20):
- Left: project name (serif 19px) + an **"Active" badge**, blurb (small muted), then a wrapped metric row — budget `TZS …M (US$…)`, trees, locations, and a canopy delta (`+8.4% canopy`) each with a leading icon.
- Right: a **200px-wide NDVI tile** (108px tall) labeled with the project short name.
- Far right: a chevron.

Clicking a card → project detail. Cards hover-highlight (`.click:hover` → `--sage-2`).

### 3. Project detail (`screen: "project"`, `id`)
- **Breadcrumb** "‹ All Projects" (→ projects list).
- **Hero card**: name (serif 26px) + Active badge; blurb; a meta row (region pin, "Started {date}", "{N} native species"). Role toggle top-right. Below, a **4-up metric-tile grid**: Budget (TZS+USD), Total trees (+survival %), CO₂ sequestered (t), Canopy change (`+%`, green, "NDVI base → now").
- **"Satellite imagery · NDVI"** card: a 320px NDVI tile ("Sentinel-2 · last pass …"). **Manager only**: a 4-up tile grid below (NDVI now, NDVI baseline, cloud cover %, tile code).
- **Locations** grid — manager: two columns (`1.1fr 1fr`) = site map + **"Site breakdown"** data table (Site / Trees / Survival, rows hover-linked to the map pins); exec: a single full-width map.
- **"Reports for this project"** section (primary "Download report" action) — list of the project's reports as clickable rows (satellite icon chip tinted by up/down, title, mono `ID · timestamp`, delta %, chevron). Empty state: "No reports generated yet for this project."

### 4. Reports list (`screen: "reports"`)
Header: eyebrow `SATELLITE UPDATES`, h1 "Reports", sub explaining each saved image becomes a short update, role toggle.

- **Summary strip**: 4 KPI cards — Saved updates (count), Not seen yet (new count, blue icon chip), Last image saved ("Jun 3", Sentinel-2 · 4% cloud), Filed for ESG (3 PDFs this quarter).
- **Filters row** (space-between): left = a 3-way segmented control **All / New / Seen** (uses the `.role-toggle` style with `--tile` bg, no shadow); right = the **date-range dropdown** + a project `<select>` (pill-styled, "All projects" + each project short name) with a leading filter icon.
- A count line "{N} updates {in the last …}".
- **List card**: each report row = a 96px-wide NDVI thumbnail, title + optional **New** badge, "{project} · {date}", and a right-aligned "Tree cover +X%" delta + chevron. Click → report detail. Empty state: "No updates match these filters."

Filtering logic: by `status` (all/new/reviewed), by `projectId`, and by date (`monthsBack <= window`). Default date range here = **All time**.

### 5. Report detail (`screen: "report"`, `id`)
- Breadcrumb "‹ Reports".
- **Header card**: title (serif 25px) + New/Active badge; sub "{project} · saved {date}". Role toggle top-right; below it, **Download PDF** (primary, if `formats` includes `pdf`) and **Email me this** (ghost, if includes `email`). Then a full-width **headline banner** tinted by direction (up = `--ok-bg`/`--ok-ink`; down = `#f3ddd6`/`#8a3320`), trend/alert icon + serif headline sentence.
- **4-up metric tiles**: Tree cover (`±X%`, "since the last image"), Trees (+survival), CO₂ stored (+ "this update"), Verified value (TZS + USD).
- **"Satellite imagery"** card: 340px NDVI tile ("{sensor} · saved {pass}").
- **Summary card** (role-aware narrative, serif 18px): exec = reassuring short version ("Nothing needs your attention — we've filed it to your ESG register."); manager = methodology line + a 2-column grid of per-site rows (name + "{trees} trees · {survival}%"). Footer buttons: "Open the project" (ghost → project detail) and "Download PDF" (if applicable).

### 6. Report settings (`screen: "settings"`)
Header: eyebrow `ACCOUNT`, h1 "Report settings", sub explaining cadence/content/recipients, role toggle.

Two-column grid (`1.3fr 1fr`):
- **Left column** (stacked cards):
  - **"Satellite images"** — a 3-way segmented control **Every pass / Monthly / Quarterly** (cadence), plus a row "Save an update each time" with an "Always" badge.
  - **"What each update shows"** — 4 toggle rows (Trees planted & survival / Tree cover change / CO₂ stored / Verified value).
  - **"How updates are shared"** — Dashboard card ("Always" badge), PDF for ESG filing (toggle), Email digest (toggle).
- **Right column**:
  - **"Who gets updates"** — two recipient tiles (Sustainability managers / Decision makers) each with an icon, description, and tag chips ("2 people", "More detail" / "3 people", "Short version").
  - **"Email digest"** — a 3-way segmented control **Instant / Weekly / Monthly**.
  - A full-width primary **"Save settings"** button.

**Toggle switch** (`Toggle`): 42×24px pill, 3px padding, an 18px white knob. On = `--green` bg, knob right; off = `#cdd9ce`, knob left; `background` transitions `.15s`. **Settings are local UI state only** in the prototype (no persistence).

---

## Components Inventory (reusable)

| Component | Notes |
|---|---|
| `Icon` | ~40-name inline-SVG set, 24×24 viewBox, `currentColor` stroke. Props: `name, size=18, stroke=2`. Replace with your icon system (Lucide covers nearly all of these names). |
| `Sidebar` | Fixed nav, brand, footer user, new-report badge. |
| `RoleToggle` | The global exec/manager segmented control. |
| `Badge` | Pill with leading dot. Kinds: `active` (green), `new` (blue), `warn` (amber), `mut` (grey). |
| `KPI` | Icon chip + label + serif value + delta pill + optional sparkline. |
| `SectionTitle` | Serif 18px section heading with optional right-aligned action. |
| `AlertBanner` | Gold-striped satellite-alert card. |
| `FormatChips` | Tag chips for output formats (Dashboard card / PDF · ESG / Email digest). |
| `DateRange` | Outside-click-dismiss dropdown of time windows; reused on Dashboard + Reports. |
| `Toggle`, `SettingRow`, `Segmented` | Settings primitives. |
| `BarCompareChart` | Grouped bars: spent vs verified, per project. |
| `TreesSurvivalChart` | Combo: trees (bars) + survival % (line on a secondary 0.6–1.0 axis). |
| `AreaTrend` | Filled area line chart with gradient; used for all time series. |
| `MiniSpark` | Tiny KPI sparkline. |
| `DonutStat` | Circular percentage gauge (survival/confidence). |
| `NDVITile` | **Placeholder** satellite tile — see below. |
| `SiteMap` | **Placeholder** map with positioned pins — see below. |

### Charts
All charts in the prototype are **hand-built inline SVG** (no library), drawn in a 720×280
(or ×230) viewBox scaled to `width:100%`. This was a prototype convenience. In production,
use the codebase's charting approach (Recharts, visx, Chart.js, native SVG, etc.) — but
**match the visual spec**: gridlines `#e6efe7`; axis labels in mono 10.5px `--muted-2`;
rounded bar corners (`rx: 4`); area fills are a vertical gradient from `0.22 → 0.02` opacity
of the line color; line stroke 2.5px with 3.5px white-filled dots at each point. Bar colors:
spent = `oklch(0.62 0.07 152)`, verified = `oklch(0.5 0.12 150)`; trees bars = `oklch(0.74 0.05 152)`,
survival line = `oklch(0.66 0.12 78)` (gold).

### NDVI satellite tiles — **needs real data**
`NDVITile` fakes satellite NDVI imagery with an SVG `feTurbulence` fractal-noise filter
remapped through a green→gold color table, plus faint road vectors and an NDVI legend +
location chip overlay. **In production, replace the procedural fill with real Sentinel-2
NDVI raster tiles** for the project's bounding box. Keep the overlay chrome: the corner
**NDVI legend** (Dense canopy / Regrowth / Sparse-bare swatches) and the bottom-left
**location chip** (rounded, translucent dark `rgba(18,38,28,.82)`, blurred backdrop).

### Site maps — **needs real geo**
`SiteMap` is a stylized SVG (soft landmass gradient, contour lines, a river, roads) with
**pins positioned by `x`/`y` percentages** (not real coordinates). Pin size scales with the
site's tree count; the active pin turns gold, shows a pulsing ring (`@keyframes ping`), and a
label tooltip. **In production, use a real map library** (Mapbox/MapLibre/Leaflet) with real
lat/lng per site, keeping the same pin styling, the tree-count size scaling, the hover↔table
cross-highlight on the project detail page, and the bottom-left "{N} planting sites" chip.

---

## State Management

| State | Scope | Notes |
|---|---|---|
| `route = { screen, role, id }` | App root | Persisted to `localStorage["pt_route"]`; restored on load. Drives routing, active nav, and the global role. |
| `role` | Derived from route | `exec` \| `manager`. Changing it stays on the current screen/id. |
| `rangeKey` (date filter) | Dashboard, Reports (local) | `3m/6m/12m/all`. Dashboard default `6m`; Reports default `all`. Drives period-aware KPI deltas + chart slicing. |
| `metric` | Impact-over-time card (local) | `co2/trees/canopy/verified`. |
| `hover` (active site) | Dashboard / Project detail (local) | Cross-links map pins ↔ table rows. |
| `status`, `proj` filters | Reports list (local) | Status + project filtering. |
| Settings toggles/segments | Settings (local) | UI-only in prototype; wire to a real preferences API in production. |

### Data shape (see `design-reference/data.js`)
Mock data lives on `window.APP_DATA`. Real implementation should fetch equivalents:
- **`company`** — `{ name, portal, account, user, email }`.
- **`projects[]`** — `{ id, name, short, blurb, status, region, started, budgetTZS, trees, survival (0–1), co2 (tonnes), locations, canopyDelta (%), ndviNow, ndviBase, species, verifiedTZS, sites[] }`. Each **site**: `{ name, trees, x, y, surv }` (`x/y` are map %; replace with `lat/lng`).
- **`portfolio`** — portfolio rollups + trend arrays (`co2Trend`, `canopyTrend`, `quarters`).
- **`reports[]`** — `{ id, projectId, project, title, generated, status (new|reviewed), monthsBack, trigger{ type, delta, threshold, dir (up|down), pass, sensor, cloud, ndviBefore, ndviAfter, confidence, tile }, formats[ dashboard|pdf|email ], headline }`.
- **`alerts[]`** — `{ id, kind, reportId, title, body, time }`.
- **`monthly`** — `{ labels[], trees[], co2[], canopy[], invested[], verified[] }` (24-month cumulative series for the date filter).
- Helpers: `FX = 2600` (1 USD = 2,600 TZS), `usd(tzs)`, `fmtTZS`, `fmtUSD`, plus the prototype's `compactTZS`/`compactUSD` (B/M/K abbreviation) for big numbers.

**Currency:** all monetary values are stored in **TZS** and shown as TZS with a parenthetical **USD** conversion at the fixed FX rate. Keep both.

---

## Interactions & Behavior

- **Navigation**: sidebar links + card/row clicks set the route; breadcrumbs go back up. Scroll resets to top on every route change.
- **Role toggle**: rewrites view depth in place; persisted; global.
- **Date range**: dropdown with outside-click dismiss; recomputes KPI deltas and slices chart series live.
- **Metric toggle** (impact card): swaps the displayed series, big number, and color.
- **Map ↔ table cross-highlight**: hovering a site row highlights its map pin (gold + pulse + tooltip) and vice-versa.
- **Filters** (Reports): status segmented control + project select + date range, combined.
- **Hover states**: nav links, clickable cards/rows (`--sage-2`), buttons (lift/shadow). Buttons translate `1px` down on `:active`.
- **Entrance animation**: `fade-in` on screen change and KPI/alert mount (`translateY(7px) → 0`, `.35s`).
- **Reduced motion / print**: the prototype does not gate animations — when productionizing, make end-states the base style and gate entrance/`ping` animations behind `@media (prefers-reduced-motion: no-preference)`.

### Buttons
- `.btn-primary`: gradient `linear-gradient(180deg,#2f5a3e,#1d3c29)`, text `#eef5ef`, pill, shadow that deepens on hover.
- `.btn-ghost`: white, `--ink-2` text, `--line` border; hover bg `--sage-2`.
- `.btn-sm`: `7px 13px`, 12.5px. `.btn-quiet`: borderless muted text link.

---

## Assets

- **Fonts**: Newsreader, Hanken Grotesk, IBM Plex Mono — all Google Fonts (load with the weights listed under Typography). The prototype loads them via `<link>`; in production self-host or use your font pipeline.
- **Icons**: inline SVG set in `ui.jsx` (`Icon`). All map onto **Lucide** equivalents (dashboard→layout-dashboard, tree→trees, co2→circle, satellite, leaf, hardhat, briefcase, etc.). Use the codebase's icon library.
- **Imagery**: NDVI tiles and site maps are procedurally faked (see above) and must be replaced with **real Sentinel-2 NDVI tiles** and a **real map library** with real coordinates.
- No raster image files are bundled — everything is CSS/SVG.

---

## Files (in `design-reference/`)

| File | Contents |
|---|---|
| `Corporate Dashboard.html` | Entry point — font links, root, script load order. |
| `styles.css` | All design tokens + every component style. **Start here for tokens.** |
| `data.js` | Mock data shape + currency/format helpers (`window.APP_DATA`). |
| `app.jsx` | Router + role state + localStorage persistence + screen switch. |
| `ui.jsx` | `Icon`, `Sidebar`, `RoleToggle`, `Badge`, `KPI`, `SectionTitle`, `AlertBanner`, `FormatChips`. |
| `charts.jsx` | `BarCompareChart`, `TreesSurvivalChart`, `AreaTrend`, `MiniSpark`, `DonutStat`. |
| `map.jsx` | `NDVITile`, `SiteMap` (both placeholders — replace with real imagery/geo). |
| `dashboard.jsx` | Dashboard screen + date-range dropdown + impact-over-time card + slice helpers. |
| `projects.jsx` | Projects list + project detail. |
| `reports.jsx` | Reports list + filters. |
| `report-detail.jsx` | Report detail screen. |
| `settings.jsx` | Report settings screen + `Toggle`/`SettingRow`/`Segmented`. |

To preview the reference: open `design-reference/Corporate Dashboard.html` in a browser (the prototype uses CDN React + in-browser Babel, so it needs a network connection on first load).
