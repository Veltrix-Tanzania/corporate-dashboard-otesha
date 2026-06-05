"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { ProjectDetailScreen, ProjectsScreen } from "@/components/screens/ProjectsScreen";
import { ReportDetailScreen } from "@/components/screens/ReportDetailScreen";
import { ReportsScreen } from "@/components/screens/ReportsScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useRoute } from "@/hooks/useRoute";
import { PortalProvider, usePortal } from "@/providers/PortalProvider";

function PortalShell() {
  const { route, role, go, navKey, hydrated } = useRoute();
  const { reports, loading, error, refetch } = usePortal();
  const newCount = reports.filter((r) => r.status === "new").length;

  if (!hydrated) {
    return (
      <div className="flex min-h-screen">
        <aside className="w-[var(--sidebar-w)] bg-forest" />
        <main className="main flex-1 bg-sage" />
      </div>
    );
  }

  let screen: React.ReactNode;
  switch (route.screen) {
    case "projects":
      screen = <ProjectsScreen role={role} go={go} />;
      break;
    case "project":
      screen = <ProjectDetailScreen role={role} id={route.id} go={go} />;
      break;
    case "reports":
      screen = <ReportsScreen role={role} go={go} />;
      break;
    case "report":
      screen = <ReportDetailScreen role={role} id={route.id} go={go} />;
      break;
    case "settings":
      screen = <SettingsScreen role={role} go={go} />;
      break;
    default:
      screen = <DashboardScreen role={role} go={go} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar navKey={navKey} go={go} newCount={newCount} loading={loading} />
      <main className="main ml-[var(--sidebar-w)] min-w-0 flex-1 px-10 pb-20 pt-[30px]">
        {loading ? (
          <LoadingState label="Loading portal data…" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <div key={route.screen + (route.id ?? "") + role} className="fade-in">
            {screen}
          </div>
        )}
      </main>
    </div>
  );
}

export function PortalApp() {
  return (
    <PortalProvider>
      <PortalShell />
    </PortalProvider>
  );
}
