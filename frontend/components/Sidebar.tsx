import { DashboardIcon, type IconName } from "./DashboardIcon";
import type { ConnectionStatus } from "@/types/dashboard";

const navigation: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "#overview", label: "Overview", icon: "grid" },
  { href: "#yield-trend", label: "Yield trend", icon: "chart" },
  { href: "#failures", label: "Failures", icon: "alert" },
  { href: "#daily-results", label: "Daily results", icon: "database" },
];

export function Sidebar({ status }: { status: ConnectionStatus }) {
  const label =
    status === "live"
      ? "Live connection"
      : status === "connecting"
        ? "Connecting"
        : "Connection unavailable";

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">V1</span>
        <div>
          <strong>Test Analytics</strong>
          <span>Operations intelligence</span>
        </div>
      </div>

      <nav aria-label="Dashboard navigation">
        {navigation.map((item, index) => (
          <a
            className={`nav-item ${index === 0 ? "active" : ""}`}
            href={item.href}
            key={item.href}
          >
            <DashboardIcon name={item.icon} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className={`status-dot ${status}`} />
        <div>
          <strong>{label}</strong>
          <span>BGW720 · Reflash</span>
        </div>
      </div>
    </aside>
  );
}
