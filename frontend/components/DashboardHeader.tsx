import type { ConnectionStatus } from "@/types/dashboard";

export function DashboardHeader({
  status,
  lastUpdated,
}: {
  status: ConnectionStatus;
  lastUpdated: Date | null;
}) {
  const statusLabel =
    status === "live"
      ? "Live data"
      : status === "connecting"
        ? "Connecting"
        : "API offline";

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">MANUFACTURING ANALYTICS</p>
        <h1>BGW720 Reflash Performance</h1>
        <p className="subtitle">
          First test, recovery and station-level visibility in one live view.
        </p>
      </div>

      <div className="topbar-meta">
        <span className={`connection-pill ${status}`}>
          <span className="status-dot" />
          {statusLabel}
        </span>
        <span className="updated">
          Updated{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </span>
      </div>
    </header>
  );
}
