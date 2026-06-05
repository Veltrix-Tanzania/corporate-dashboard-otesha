/* ============================================================
   App · router + role state
   ============================================================ */
const { useState, useEffect } = React;

function App() {
  const D = window.APP_DATA;
  const newCount = D.reports.filter((r) => r.status === "new").length;

  const load = () => {
    try { return JSON.parse(localStorage.getItem("pt_route") || "null") || { screen: "dashboard", role: "exec" }; }
    catch { return { screen: "dashboard", role: "exec" }; }
  };
  const [route, setRoute] = useState(load);
  const role = route.role || "exec";

  useEffect(() => { localStorage.setItem("pt_route", JSON.stringify(route)); }, [route]);
  // scroll to top on screen change (never use scrollIntoView)
  useEffect(() => { const m = document.querySelector(".main"); if (m) m.scrollTop = 0; window.scrollTo(0, 0); }, [route.screen, route.id]);

  const go = (next) => setRoute((cur) => ({ role: next.role || cur.role, ...next }));

  let screen;
  switch (route.screen) {
    case "projects": screen = <ProjectsScreen role={role} go={go} />; break;
    case "project":  screen = <ProjectDetailScreen role={role} id={route.id} go={go} />; break;
    case "reports":  screen = <ReportsScreen role={role} go={go} />; break;
    case "report":   screen = <ReportDetailScreen role={role} id={route.id} go={go} />; break;
    case "settings": screen = <SettingsScreen role={role} go={go} />; break;
    default:         screen = <DashboardScreen role={role} go={go} />;
  }

  // active nav key (report detail keeps Reports active, project detail keeps Projects)
  const navKey = route.screen === "report" ? "reports" : route.screen === "project" ? "projects" : route.screen;

  return (
    <div className="app">
      <Sidebar route={{ screen: navKey }} go={go} newCount={newCount} />
      <main className="main">
        <div key={route.screen + (route.id || "") + role} className="fade-in">{screen}</div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
